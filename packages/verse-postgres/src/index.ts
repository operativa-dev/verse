import {
  DateAsTimestampWithTimeZone,
  DefaultSequence,
  SeqHiloKey,
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
  SqlBinary,
  SqlBinaryOperator,
  SqlColumn,
  SqlCreateDatabase,
  SqlDropDatabase,
  SqlFunction,
  sqlId,
  SqlIdentifier,
  SqlMember,
  SqlNode,
  SqlNumber,
  SqlParameter,
  SqlSelect,
  sqlStr,
  SqlType,
  SqlTypeAlias,
} from "@operativa/verse/db/sql";
import { notEmpty } from "@operativa/verse/utils/check";
import { logBatch, Logger, logSql } from "@operativa/verse/utils/logging";
import { List } from "immutable";
import pg from "postgres";

export function postgres(connectionString: string) {
  return new PostgresDriver(connectionString);
}

export class PostgresDriver implements Driver, AsyncDisposable {
  readonly #pg: pg.Sql;

  #logger?: Logger | undefined;

  constructor(connectionString: string) {
    notEmpty({ connectionString });

    this.#pg = pg(connectionString, {
      types: {
        bigint: pg.BigInt,
      },
      connection: {},
    });
  }

  get info() {
    return {
      name: "postgresql",
      server: this.#pg.options.host[0]!,
      database: this.#pg.options.database,
    };
  }

  set logger(logger: Logger | undefined) {
    this.#logger = logger;
  }

  get conventions() {
    return List.of(new DefaultSequence(), new SeqHiloKey(), new DateAsTimestampWithTimeZone());
  }

  rows(sql: SqlNode) {
    return (args: unknown[]) =>
      this.#query(sql.accept(new DialectRewriter()).accept(new PgSqlPrinter()), args);
  }

  async *#query(sql: string, args: unknown[]) {
    logSql(sql, args, this.#logger);

    const values = await this.#pg.unsafe(sql, args as any[]).values();

    for await (const r of values) {
      yield r;
    }
  }

  async execute(
    statements: ExecuteStatement[],
    isolation?: IsolationLevel,
    onBeforeCommit?: (results: ExecuteResult[]) => void
  ) {
    const batch = statements.map(stmt => ({
      ...stmt,
      sql: stmt.sql.accept(new PgSqlPrinter()),
      args: stmt.args ?? [],
      readable: stmt.sql.readable,
    }));

    logBatch(batch, this.#logger);

    const results: ExecuteResult[] = [];

    await this.#pg.begin(this.#mapIsolation(isolation), async pg => {
      for (const op of batch) {
        op.onBeforeExecute?.(op.args);

        const pendingQuery = pg.unsafe(op.sql, op.args as any[]);

        let returning: unknown[] = [];
        let rowsAffected = 0;

        if (op.readable) {
          for await (returning of await pendingQuery.values()) {
            rowsAffected = 1;
          }
        } else {
          rowsAffected = (await pendingQuery.execute()).count;
        }

        const result = { rowsAffected, returning };

        results.push(result);

        op.onAfterExecute?.(result);
      }

      onBeforeCommit?.(results);
    });

    return results;
  }

  script(statements: ExecuteStatement[]) {
    const printer = new PgSqlPrinter();

    return statements.map(stmt => stmt.sql.accept(printer));
  }

  #mapIsolation(isolation?: IsolationLevel) {
    if (!isolation) {
      return "";
    }

    if (isolation === "snapshot") {
      throw new Error("Snapshot isolation is not supported by PostgreSQL.");
    }

    return `isolation level ${isolation}`;
  }

  exists() {
    return this.#usingSystemDb(async pg => this.#exists(pg));
  }

  static readonly #EXISTS = new SqlSelect({
    projection: SqlNumber.ONE,
    from: sqlId("pg_database"),
    where: sqlBin(sqlId("datname"), "=", new SqlParameter(0)),
  });

  async #exists(pg: PostgresDriver) {
    // noinspection LoopStatementThatDoesntLoopJS
    for await (const _ of pg.rows(PostgresDriver.#EXISTS)([this.#pg.options.database])) {
      return true;
    }

    return false;
  }

  static readonly #TABLE_EXISTS = new SqlSelect({
    projection: SqlNumber.ONE,
    from: new SqlMember(sqlId("information_schema"), sqlId("tables")),
    where: sqlBin(
      sqlBin(sqlId("table_schema"), "=", sqlStr("public")),
      "and",
      sqlBin(sqlId("table_name"), "=", new SqlParameter(0))
    ),
  });

  async tableExists(name: string) {
    notEmpty({ name });

    // noinspection LoopStatementThatDoesntLoopJS
    for await (const _ of this.rows(PostgresDriver.#TABLE_EXISTS)([name])) {
      return true;
    }

    return false;
  }

  async create() {
    return this.#usingSystemDb(async pg => {
      const sql = new SqlCreateDatabase(sqlId(this.#pg.options.database)).accept(
        new PgSqlPrinter()
      );

      logSql(sql, [], this.#logger);

      await pg.#pg.unsafe(sql);
    });
  }

  async drop() {
    return this.#usingSystemDb(async pg => {
      if (!(await this.#exists(pg))) {
        return;
      }

      const sql = new SqlDropDatabase(sqlId(this.#pg.options.database)).accept(new PgSqlPrinter());

      logSql(sql, [], this.#logger);

      await pg.#pg.unsafe(sql);
    });
  }

  async #usingSystemDb<T>(block: (pg: PostgresDriver) => Promise<T>) {
    const db = this.#systemDb();

    try {
      return await block(db);
    } finally {
      await db[Symbol.asyncDispose]();
    }
  }

  #systemDb() {
    const o = this.#pg.options;
    const driver = postgres(`postgres://${o.user}:${o.pass}@${o.host}:${o.port}/postgres`);
    driver.logger = this.#logger;
    return driver;
  }

  [Symbol.asyncDispose]() {
    return this.#pg.end();
  }
}

class DialectRewriter extends SqlRewriter {
  override visitFunction(func: SqlFunction) {
    const newFunction = super.visitFunction(func) as SqlFunction;

    if (newFunction.name === "json_arrayagg") {
      return new SqlFunction("json_agg", newFunction.args);
    }

    if (newFunction.name === "json_array") {
      return new SqlFunction("json_build_array", newFunction.args);
    }

    return newFunction;
  }

  override visitBinary(binary: SqlBinary) {
    const newBinary = super.visitBinary(binary) as SqlBinary;

    if (
      (SqlBinaryOperator.isComparison(newBinary.op) ||
        SqlBinaryOperator.isArithmetic(newBinary.op)) &&
      !SqlType.isNumeric(newBinary.left.type) &&
      SqlType.isNumeric(newBinary.right.type)
    ) {
      return sqlBin(
        new SqlFunction("cast", List.of(new SqlTypeAlias(newBinary.left, newBinary.right.type!))),
        newBinary.op,
        newBinary.right,
        newBinary.binding
      );
    }

    return newBinary;
  }
}

class PgSqlPrinter extends SqlPrinter {
  constructor() {
    super();
  }

  override visitParameter(parameter: SqlParameter) {
    return `$${parameter.id + 1}`;
  }

  override visitIdentifier(identifier: SqlIdentifier) {
    return super.visitIdentifier(identifier);
  }

  override visitColumn(column: SqlColumn) {
    let sql = super.visitColumn(column);

    if (column.identity) {
      sql += ` generated always as identity`;
    }

    return sql;
  }
}
