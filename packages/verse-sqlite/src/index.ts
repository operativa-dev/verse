import {
  BooleansToOneOrZero,
  DateAsTimestamp,
  DatePropertyToISOString,
  DatesToISOStrings,
  IdentityKey,
} from "@operativa/verse/conventions/database";
import {
  Driver,
  ExecuteResult,
  ExecuteStatement,
  IsolationLevel,
} from "@operativa/verse/db/driver";
import { explodeIn, hasInParameter } from "@operativa/verse/db/in";
import { SqlPrinter } from "@operativa/verse/db/printer";
import { SqlRewriter } from "@operativa/verse/db/rewriter";
import {
  sqlBin,
  SqlColumn,
  SqlFunction,
  sqlId,
  SqlIn,
  SqlNode,
  SqlNumber,
  SqlParameter,
  SqlSelect,
  sqlStr,
} from "@operativa/verse/db/sql";
import { Model, ScalarPropertyModel } from "@operativa/verse/model/model";
import { ModelRewriter } from "@operativa/verse/model/rewriter";
import { notEmpty } from "@operativa/verse/utils/check";
import { logBatch, Logger, logSql } from "@operativa/verse/utils/logging";
import { error } from "@operativa/verse/utils/utils";
import Database, { Statement } from "better-sqlite3";
import { existsSync } from "fs";
import { unlink } from "fs/promises";
import { List } from "immutable";

export function sqlite(connectionString: string) {
  return new SqliteDriver(connectionString);
}

export class SqliteDriver implements Driver {
  #db?: Database.Database;
  #logger?: Logger | undefined;

  constructor(readonly connectionString: string) {
    notEmpty({ connectionString });
  }

  validate(model: Model) {
    model.accept(new Validator());
  }

  get info() {
    return {
      name: "sqlite",
      server: "",
      database: this.db.name,
    };
  }

  set logger(logger: Logger | undefined) {
    this.#logger = logger;
  }

  get conventions() {
    return List.of(
      new IdentityKey(),
      new BooleansToOneOrZero(),
      new DateAsTimestamp(),
      new DatePropertyToISOString(),
      new DatesToISOStrings()
    );
  }

  private get db() {
    if (!this.#db) {
      this.#open();
    }

    return this.#db!;
  }

  #open() {
    this.#db = new Database(this.connectionString);
    this.#db.pragma("journal_mode = WAL");
  }

  rows(sql: SqlNode) {
    if (!hasInParameter(sql)) {
      const printer = new SqlitePrinter();
      const stmt = this.#prepare(sql, new DialectRewriter(), printer);

      return (args: readonly unknown[]) => this.#query(stmt, args, printer.argsMap);
    }

    return (args: unknown[]) => {
      const printer = new SqlitePrinter();
      const stmt = this.#prepare(sql, new DialectRewriter(args), printer);

      return this.#query(stmt, args, printer.argsMap);
    };
  }

  #prepare(sql: SqlNode, dialect: DialectRewriter, printer: SqlitePrinter) {
    const query = sql.accept(dialect).accept(printer);

    try {
      return this.db.prepare(query).raw();
    } catch (e) {
      logSql(query, [], this.#logger);
      throw e;
    }
  }

  async *#query(stmt: Statement, args: readonly unknown[], argsMap: readonly number[]) {
    logSql(stmt.source, args, this.#logger);

    for (const row of stmt.iterate(argsMap.map(i => args[i]))) {
      yield row as readonly unknown[];
    }
  }

  async execute(
    statements: readonly ExecuteStatement[],
    isolation?: IsolationLevel,
    onCommit?: (results: readonly ExecuteResult[]) => void
  ) {
    const batch = statements.map(stmt => {
      const printer = new SqlitePrinter();

      const args = stmt.args ?? [];

      return {
        ...stmt,
        sql: stmt.sql.accept(new DialectRewriter(args)).accept(printer),
        args,
        argsMap: printer.argsMap,
        readable: stmt.sql.readable,
      };
    });

    logBatch(batch, this.#logger);

    const results: ExecuteResult[] = [];

    const tx = this.db.transaction(() => {
      batch.map(op => {
        const stmt = this.db.prepare(op.sql);
        const mappedArgs = op.argsMap.map(i => op.args[i]);

        op.onBeforeExecute?.(mappedArgs);

        let returning: unknown[] = [];
        let rowsAffected: number;

        if (!op.readable) {
          const result = stmt.run(mappedArgs);
          rowsAffected = result.changes;
        } else {
          returning = stmt.raw().get(mappedArgs) as unknown[];
          rowsAffected = 1;
        }

        const result = { rowsAffected, returning };

        results.push(result);

        op.onAfterExecute?.(result);
      });
    });

    switch (isolation) {
      case "read uncommitted":
        try {
          this.db.pragma("read_uncommitted = true");
          tx();
        } finally {
          this.db.pragma("read_uncommitted = false");
        }
        break;

      case "read committed":
        tx.immediate();
        break;

      case "repeatable read":
      case "snapshot":
        throw new Error(`'${isolation}' isolation is not supported by SQLite.`);

      case "serializable":
        tx.exclusive();
        break;

      default:
        tx();
    }

    onCommit?.(results);

    return results;
  }

  script(statements: readonly ExecuteStatement[]) {
    const dialect = new DialectRewriter([]);
    const printer = new SqlitePrinter();

    return statements.map(stmt => stmt.sql.accept(dialect).accept(printer));
  }

  async create() {
    this.#open();
  }

  async drop() {
    this.db.close();

    if (!this.#memory && (await this.exists())) {
      await unlink(this.connectionString);
    }
  }

  async exists() {
    return this.#memory || existsSync(this.connectionString);
  }

  get #memory() {
    return this.connectionString === ":memory:";
  }

  static readonly #TABLE_EXISTS = new SqlSelect({
    projection: SqlNumber.ONE,
    from: sqlId("sqlite_master"),
    where: sqlBin(
      sqlBin(sqlId("type"), "=", sqlStr("table")),
      "and",
      sqlBin(sqlId("name"), "=", new SqlParameter(0))
    ),
  });

  async tableExists(name: string) {
    notEmpty({ name });

    // noinspection LoopStatementThatDoesntLoopJS
    for await (const _ of this.rows(SqliteDriver.#TABLE_EXISTS)([name])) {
      return true;
    }

    return false;
  }
}

class DialectRewriter extends SqlRewriter {
  constructor(private args: unknown[] = []) {
    super();
  }

  override visitFunction(func: SqlFunction) {
    const newFunction = super.visitFunction(func) as SqlFunction;

    if (newFunction.name === "json_arrayagg") {
      return new SqlFunction("json_group_array", newFunction.args);
    }

    if (newFunction.name === "now") {
      return new SqlFunction("datetime", List.of(sqlStr("now")));
    }

    return newFunction;
  }

  override visitColumn(column: SqlColumn) {
    const newColumn = super.visitColumn(column) as SqlColumn;

    if (newColumn.type === "uuid") {
      return newColumn.withType("text");
    }

    return newColumn;
  }

  override visitIn(_in: SqlIn) {
    if (this.args.length > 0) {
      return explodeIn(_in, this.args);
    }

    return _in;
  }
}

class SqlitePrinter extends SqlPrinter {
  #argsMap: number[] = [];

  constructor() {
    super();
  }

  get argsMap(): readonly number[] {
    return this.#argsMap;
  }

  override visitParameter(parameter: SqlParameter) {
    this.#argsMap.push(parameter.id);

    return "?";
  }

  protected override visitOffset(offset: SqlNode) {
    return `\nlimit -1 offset ${offset.accept(this)}`;
  }
}

class Validator extends ModelRewriter {
  override visitScalarProperty(scalarProperty: ScalarPropertyModel) {
    if (scalarProperty.generate?.using === "seqhilo") {
      error(
        `Scalar property '${scalarProperty.name}' cannot use 'seqhilo' generator.
        SQLite does not support sequences.`
      );
    }

    return super.visitScalarProperty(scalarProperty);
  }
}
