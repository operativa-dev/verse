import { Convention } from "@operativa/verse/conventions/convention";
import {
  BooleansToOneOrZero,
  DateAsTimestamp,
  DatePropertyToISOString,
  IdentityKey,
} from "@operativa/verse/conventions/database";
import {
  Driver,
  ExecuteResult,
  ExecuteStatement,
  IsolationLevel,
} from "@operativa/verse/db/driver";
import { SqlPrinter } from "@operativa/verse/db/printer";
import { SqlRewriter } from "@operativa/verse/db/rewriter";
import {
  sqlBin,
  SqlColumn,
  SqlFunction,
  sqlId,
  SqlNode,
  SqlNumber,
  SqlParameter,
  SqlSelect,
  sqlStr,
} from "@operativa/verse/db/sql";
import { notEmpty } from "@operativa/verse/utils/check";
import { logBatch, Logger, logSql } from "@operativa/verse/utils/logging";
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

  get conventions(): List<Convention> {
    return List.of(
      new IdentityKey(),
      new BooleansToOneOrZero(),
      new DateAsTimestamp(),
      new DatePropertyToISOString()
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
    const printer = new SqlitePrinter();
    const query = sql.accept(new DialectRewriter()).accept(printer);
    let stmt: Statement;

    try {
      stmt = this.db.prepare(query).raw();
    } catch (e) {
      logSql(query, [], this.#logger);
      throw e;
    }

    return (args: unknown[]) => this.#query(stmt, args, printer.argsMap);
  }

  async *#query(stmt: Statement, args: unknown[], argsMap: number[]): AsyncIterable<unknown[]> {
    logSql(stmt.source, args, this.#logger);

    for (const row of stmt.iterate(argsMap.map(i => args[i]))) {
      yield row as unknown[];
    }
  }

  async execute(
    statements: ExecuteStatement[],
    isolation?: IsolationLevel,
    onBeforeCommit?: (results: ExecuteResult[]) => void
  ) {
    const dialect = new DialectRewriter();

    const batch = statements.map(stmt => {
      const printer = new SqlitePrinter();

      return {
        ...stmt,
        sql: stmt.sql.accept(dialect).accept(printer),
        args: stmt.args ?? [],
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

      onBeforeCommit?.(results);
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

    return results;
  }

  script(statements: ExecuteStatement[]) {
    const dialect = new DialectRewriter();
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
    projection: new SqlNumber(1),
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
}

class SqlitePrinter extends SqlPrinter {
  #argsMap: number[] = [];

  constructor() {
    super();
  }

  get argsMap(): number[] {
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
