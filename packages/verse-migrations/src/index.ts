import { Metadata, verse, Verse } from "@operativa/verse";
import { Driver, DriverInfo, ExecuteStatement } from "@operativa/verse/db/driver";
import {
  primitiveToSql,
  SqlAddColumn,
  sqlBin,
  SqlBinary,
  SqlColumn,
  SqlCreateIndex,
  SqlCreateSequence,
  SqlCreateTable,
  SqlDelete,
  SqlDropColumn,
  SqlDropIndex,
  SqlDropSequence,
  SqlDropTable,
  sqlId,
  SqlInsert,
  SqlNode,
  SqlNumber,
  SqlRaw,
  SqlRenameColumn,
  SqlRenameTable,
  sqlStr,
  SqlType,
  SqlUpdate,
} from "@operativa/verse/db/sql";
import { entity, string } from "@operativa/verse/model/builder";
import { EntityModel, Model } from "@operativa/verse/model/model";
import { notNull } from "@operativa/verse/utils/check";
import { Logger, NullLogger } from "@operativa/verse/utils/logging";
import fs, { existsSync } from "fs";
import Immutable, { List } from "immutable";
import * as path from "path";
import { NonEmptyObject, Primitive } from "ts-essentials";
import { ModelDiffer } from "./differ.js";
import { CodeGenerator } from "./generator.js";

export interface Migration {
  (db: DB): void;
}

export function column(type: SqlType, nullable = true) {
  return (name: string) => new SqlColumn(sqlId(name), type, nullable);
}

type Literal = Primitive | Date;

export class DB {
  readonly #model: Model;

  #ops: List<SqlNode> = List();

  constructor(
    readonly info: DriverInfo,
    model: Model
  ) {
    this.#model = model;
  }

  get ops(): Immutable.List<SqlNode> {
    return this.#ops;
  }

  createTable<T extends { [key: string]: (name: string) => SqlColumn }>(
    name: string,
    columns: NonEmptyObject<T>
  ) {
    this.#op(new SqlCreateTable(sqlId(name), List(Object.keys(columns).map(k => columns[k]!(k)))));
  }

  dropTable(name: string) {
    this.#op(new SqlDropTable(sqlId(name)));
  }

  renameTable(oldName: string, newName: string) {
    this.#op(new SqlRenameTable(sqlId(oldName), sqlId(newName)));
  }

  addColumn(table: string, name: string, type: SqlType) {
    this.#op(new SqlAddColumn(sqlId(table), new SqlColumn(sqlId(name), type)));
  }

  dropColumn(table: string, name: string) {
    this.#op(new SqlDropColumn(sqlId(table), sqlId(name)));
  }

  renameColumn(table: string, oldName: string, newName: string) {
    this.#op(new SqlRenameColumn(sqlId(table), sqlId(oldName), sqlId(newName)));
  }

  createIndex(name: string, table: string, ...columns: string[]) {
    this.#op(new SqlCreateIndex(sqlId(name), sqlId(table), List(columns.map(c => sqlId(c)))));
  }

  dropIndex(table: string, name: string) {
    this.#op(new SqlDropIndex(sqlId(table), sqlId(name)));
  }

  createSequence(name: string, start = 1, increment = 1) {
    this.#op(new SqlCreateSequence(sqlId(name), new SqlNumber(start), new SqlNumber(increment)));
  }

  dropSequence(name: string) {
    this.#op(new SqlDropSequence(sqlId(name)));
  }

  insert(table: string, columns: string[], ...rows: Literal[][]) {
    rows.forEach(row => {
      this.#op(
        new SqlInsert(
          sqlId(table),
          List(columns.map(c => sqlId(c))),
          List(row.map(v => this.#primitiveToSql(v)))
        )
      );
    });
  }

  update(
    table: string,
    assignments: { [column: string]: Literal },
    where: { [column: string]: Literal }
  ) {
    this.#op(
      new SqlUpdate(
        sqlId(table),
        List(
          Object.entries(assignments).map(e => sqlBin(sqlId(e[0]), "=", this.#primitiveToSql(e[1])))
        ),
        Object.entries(where)
          .map(e => sqlBin(sqlId(e[0]), "=", this.#primitiveToSql(e[1])))
          .reduce((acc: SqlBinary, next) => (acc ? sqlBin(acc, "and", next) : next))
      )
    );
  }

  delete(table: string, where: { [column: string]: Literal }) {
    this.#op(
      new SqlDelete(
        sqlId(table),
        Object.entries(where)
          .map(e => sqlBin(sqlId(e[0]), "=", this.#primitiveToSql(e[1])))
          .reduce((acc: SqlBinary, next) => (acc ? sqlBin(acc, "and", next) : next))
      )
    );
  }

  #primitiveToSql(value: Literal): SqlNode {
    const [node, conversion] = primitiveToSql(value, this.#model);

    return conversion && "value" in node
      ? this.#primitiveToSql(conversion.write(node.value))
      : node;
  }

  sql(sql: string) {
    this.#op(new SqlRaw(List.of(sql), List()));
  }

  #op(op: SqlNode) {
    this.#ops = this.#ops.push(op);
  }
}

export type MigrationInfo = {
  id: string;
  name: string;
  file: string;
  applied: boolean;
};

export type MigrationStatus = {
  database: string;
  databaseExists: boolean;
  directory: string;
  directoryExists: boolean;
  tableExists: boolean;
  migrations: MigrationInfo[];
};

class DbMigration {
  constructor(readonly id: string) {}
}

const migrationRegex = /(^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-([\w\s-.]+))(((?<!\.d)\.ts)|\.js)$/;

export class Migrator {
  public static readonly MIGRATIONS_TABLE = "__verse_migrations";

  readonly #directory: string;
  readonly #directoryExists: boolean;
  readonly #system: Verse<{ migrations: EntityModel<DbMigration> }>;
  readonly #metadata: Metadata;

  constructor(userVerse: Verse, directory?: string, logger?: Logger) {
    notNull({ userVerse });

    this.#directory = directory ?? `${process.cwd()}/migrations`;
    this.#directoryExists = existsSync(this.#directory);
    this.#metadata = userVerse.metadata;

    this.#system = verse({
      config: {
        driver: userVerse.config.driver,
        logger: logger ?? NullLogger.INSTANCE,
      },
      model: {
        entities: {
          migrations: entity(DbMigration, { id: string() }, e => {
            e.table(Migrator.MIGRATIONS_TABLE);
          }),
        },
      },
    });
  }

  async create(name: string) {
    if (!this.#directoryExists) {
      await fs.promises.mkdir(this.#directory);
    }

    const modelPath = `${this.#directory}/model.json`;

    let previous: ReturnType<Model["toObject"]> | undefined;

    if (existsSync(modelPath)) {
      previous = JSON.parse(await fs.promises.readFile(modelPath, "utf8"));
    }

    const filename = `${this.#timestamped(name)}.ts`;

    if (!migrationRegex.test(filename)) {
      throw new Error(`Invalid migration name: '${name}'.`);
    }

    const path = `${this.#directory}/${filename}`;

    if (existsSync(path)) {
      throw new Error(`Migration ${name} already exists`);
    }

    const ops = await new ModelDiffer(this.#metadata).diff(previous);
    const code = new CodeGenerator().generate(ops);

    await fs.promises.writeFile(path, code);
    await fs.promises.writeFile(modelPath, this.#metadata.model.toJSON());

    return path;
  }

  async status() {
    let local: MigrationInfo[] = [];

    if (this.#directoryExists) {
      local = (await fs.promises.readdir(this.#directory))
        .map(f => path.parse(f).base.match(migrationRegex))
        .filter(m => m)
        .map(
          m =>
            ({
              id: m![1],
              name: m![2],
              file: m![0],
              applied: false,
            }) as MigrationInfo
        );
    }

    let databaseExists = await this.#system.database.exists();
    let tableExists = false;

    let applied: DbMigration[] = [];

    if (databaseExists) {
      tableExists = await this.#tableExists();

      if (tableExists) {
        applied = await this.#system.from.migrations.orderBy(m => m.id).toArray();
      }
    }

    const migrations = local.map(m => {
      const dbMigration = applied.find(a => a.id === m.id);

      return dbMigration
        ? ({
            ...m,
            applied: true,
          } as MigrationInfo)
        : m;
    });

    return {
      database: this.#system.config.driver.info.database,
      databaseExists,
      directory: this.#directory,
      directoryExists: this.#directoryExists,
      tableExists,
      migrations,
    } as MigrationStatus;
  }

  async migrate(onApplied?: (migration: MigrationInfo) => void) {
    return this.#migrateCore(
      driver => driver.create(),
      (driver, statements) => driver.execute(statements, "serializable"),
      (_, migration) => {
        if (migration) {
          onApplied?.(migration);
        }
      }
    );
  }

  async script(header = true) {
    let script = "";

    await this.#migrateCore(
      async _ => {},
      async (driver, statements) => driver.script(statements),
      (result, migration) => {
        if (migration) {
          script += `-- Migration: '${migration.id}'\n\n`;
        } else {
          script += "-- Setup: create Verse migrations table\n\n";
        }

        script += result.join(";\n\n") + ";\n\n";
      }
    );

    return header
      ? `-- ⚡️ Verse migrations script generated on ${new Date().toDateString()} ⚡️\n\n` + script
      : script;
  }

  async #migrateCore<T>(
    create: (driver: Driver) => Promise<void>,
    execute: (driver: Driver, statements: ExecuteStatement[]) => Promise<T>,
    onApplied: (result: T, migration?: MigrationInfo) => void
  ) {
    const status = await this.status();
    const driver = this.#system.config.driver;

    if (!status.databaseExists) {
      await create(driver);
    }

    if (!status.tableExists) {
      const result = await execute(driver, [
        ...this.#system.database.schema().map(sql => ({ sql })),
      ]);

      onApplied(result);
    }

    for (const m of status.migrations) {
      if (!m.applied) {
        const operations: ExecuteStatement[] = [];
        const module = await import(`${this.#directory}/${m.file}`);
        const migration = module.default;

        if (!migration) {
          throw new Error(`No default export found in migration '${m.file}'.`);
        }

        if (typeof migration !== "function") {
          throw new Error(`Default export in '${m.file}' is not a function.`);
        }

        const db = new DB(driver.info, this.#metadata.model);

        migration(db);

        operations.push(...db.ops.map(sql => ({ sql })));

        operations.push({
          sql: new SqlInsert(
            sqlId(Migrator.MIGRATIONS_TABLE),
            List.of(sqlId("Id")),
            List.of(sqlStr(m.id))
          ),
        });

        const result = await execute(driver, operations);

        onApplied(result, m);
      }
    }
  }

  async #tableExists() {
    return this.#system.config.driver.tableExists(Migrator.MIGRATIONS_TABLE);
  }

  #timestamped(name: string) {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}-${hours}-${minutes}-${name}`;
  }
}
