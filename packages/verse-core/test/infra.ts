import { List } from "immutable";
import path from "node:path";
import { afterEach, beforeAll, beforeEach, Custom, TaskContext, test, Test } from "vitest";
import { Driver } from "../src/db/driver.js";
import { ModelBinder } from "../src/model/binder.js";
import { EntityModel, Model, StructuralModel, ValueObjectModel } from "../src/model/model.js";
import { AsyncSequence } from "../src/query/queryable.js";
import { Logger, PrettyConsoleLogger } from "../src/utils/logging.js";
import { Entities, ModelBuilder, Verse, verse } from "../src/verse.js";

export class SqlSpy extends PrettyConsoleLogger {
  $sql = "";

  override sql(sql: string) {
    super.sql(sql);
    this.$sql += sql + "\n\n";
  }
}

export const dataTest = (verse: Verse) => {
  let $data: unknown[] = [];

  beforeEach(() => {
    resetSql(verse);
    $data = [];
  });

  afterEach(async ctx => {
    await snapSql(ctx, verse);
    await snap(ctx, $data);
  });

  test("model", async ctx => {
    await snapModel(ctx, verse);
  });

  return async (query: Promise<unknown> | AsyncSequence<unknown>) =>
    ($data = isAsyncSequence(query) ? await query.toArray() : [await query]);
};

export const dbTest = (verse: Verse) => {
  beforeAll(async () => {
    await verse.database.recreate();
  });

  beforeEach(() => resetSql(verse));

  afterEach(async ctx => {
    await snapSql(ctx, verse);
  });

  test("model", async ctx => {
    await snapModel(ctx, verse);
  });
};

export function isAsyncSequence(
  data: Promise<unknown> | AsyncSequence<unknown>
): data is AsyncSequence<unknown> {
  return (data as AsyncSequence<unknown>).toArray !== undefined;
}

export function resetSql(orm: Verse) {
  (orm.config.logger as SqlSpy).$sql = "";
}

export async function snapSql(ctx: TaskContext<Test | Custom>, orm: Verse) {
  return await snap(ctx, stripUuids((orm.config.logger as SqlSpy).$sql), "sql");
}

function stripUuids(sql: string) {
  const uuidRegExp =
    /[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}/gi;
  return sql.replace(uuidRegExp, "<UUID>");
}

export async function snapModel(ctx: TaskContext<Test>, orm: Verse) {
  await snap(ctx, stripUuids(orm.metadata.model.toJSON()), "json");
}

export async function snap(ctx: TaskContext<Test | Custom>, $it: unknown, extension = "snap") {
  if (ctx.task.name === "model" && extension !== "json") {
    return;
  }

  const file = `./__snapshots__/${path.basename(
    ctx.task.suite.file!.name,
    ".test.ts"
  )}/${ctx.task.suite.name.replaceAll(" ", "_")}/${ctx.task.name.replaceAll(" ", "_")}.${extension}`;

  return await ctx.task.context.expect($it).toMatchFileSnapshot(file);
}

export function modelOf(...entities: EntityModel[]) {
  return new Model(List(entities));
}

export function boundModelOf(...types: StructuralModel[]) {
  const entities = List(types.filter(t => t instanceof EntityModel)) as List<EntityModel>;
  const values = List(types.filter(t => t instanceof ValueObjectModel)) as List<ValueObjectModel>;

  return new ModelBinder().bind(new Model(entities, values));
}

export const fixture = <TEntities extends Entities>(
  driver: Driver,
  entitiesOrModel: TEntities | ModelBuilder<TEntities>,
  logger?: Logger
) => {
  if (!("entities" in entitiesOrModel)) {
    entitiesOrModel = { entities: entitiesOrModel };
  }

  return verse({
    config: { driver, logger: logger ?? new SqlSpy(), isolation: "read committed" },
    model: entitiesOrModel as ModelBuilder<TEntities>,
  });
};
