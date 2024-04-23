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
import { explodeIn, hasInParameter } from "@operativa/verse/db/in";
import { SqlPrinter } from "@operativa/verse/db/printer";
import { SqlRewriter } from "@operativa/verse/db/rewriter";
import {
  SqlAlterColumn,
  sqlBin,
  SqlBinary,
  SqlBinaryOperator,
  SqlColumn,
  SqlCreateDatabase,
  SqlDropDatabase,
  SqlFunction,
  sqlId,
  SqlIdentifier,
  SqlIn,
  SqlMember,
  SqlNextValue,
  SqlNode,
  SqlNumber,
  SqlParameter,
  SqlSelect,
  sqlStr,
  SqlTimestamp,
  SqlType,
  SqlTypeAlias,
} from "@operativa/verse/db/sql";
import { Model } from "@operativa/verse/model/model";
import { notEmpty } from "@operativa/verse/utils/check";
import { logBatch, Logger, logSql } from "@operativa/verse/utils/logging";
import { List } from "immutable";
import pg from "postgres";
import isNumeric = SqlType.isNumeric;

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

  // @ts-ignore
  validate(model: Model) {}

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
    const printer = new PgSqlPrinter();

    // noinspection DuplicatedCode
    if (!hasInParameter(sql)) {
      const query = sql.accept(new DialectRewriter()).accept(printer);

      return (args: readonly unknown[]) => {
        return this.#query(query, args);
      };
    }

    return (args: unknown[]) => {
      const query = sql.accept(new DialectRewriter(args)).accept(printer);

      return this.#query(query, args);
    };
  }

  async *#query(sql: string, args: readonly unknown[]) {
    logSql(sql, args, this.#logger);

    const values = await this.#pg.unsafe(sql, args as any[]).values();

    for await (const r of values) {
      yield r as readonly unknown[];
    }
  }

  async execute(
    statements: readonly ExecuteStatement[],
    isolation?: IsolationLevel,
    onCommit?: (results: readonly ExecuteResult[]) => void
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
    });

    onCommit?.(results);

    return results;
  }

  script(statements: readonly ExecuteStatement[]) {
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

  async exists() {
    await using pg = this.#systemDb();

    return await this.#exists(pg);
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
    await using pg = this.#systemDb();

    const sql = new SqlCreateDatabase(sqlId(this.#pg.options.database)).accept(new PgSqlPrinter());

    logSql(sql, [], this.#logger);

    await pg.#pg.unsafe(sql);
  }

  async drop() {
    await using pg = this.#systemDb();

    if (!(await this.#exists(pg))) {
      return;
    }

    const sql = new SqlDropDatabase(sqlId(this.#pg.options.database)).accept(new PgSqlPrinter());

    logSql(sql, [], this.#logger);

    await pg.#pg.unsafe(sql);
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
  constructor(private args: unknown[] = []) {
    super();
  }

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
      !isNumeric(newBinary.left.type) &&
      isNumeric(newBinary.right.type)
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

  override visitIn(_in: SqlIn) {
    if (this.args.length > 0) {
      return explodeIn(_in, this.args);
    }

    return _in;
  }

  override visitNextValue(nextValue: SqlNextValue) {
    return new SqlFunction("nextval", List.of(sqlStr(nextValue.sequence.name)));
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

  override visitAlterColumn(alterColumn: SqlAlterColumn): string {
    const alters = [];
    const column = alterColumn.column;

    if (column.default !== undefined) {
      alters.push(`alter ${column.name.accept(this)} set default ${column.default.accept(this)}`);
    }

    if (column.identity) {
      alters.push(`alter ${column.name.accept(this)} add generated always as identity`);
    } else if (column.identity === false) {
      alters.push(`alter ${column.name.accept(this)} drop identity`);
    }

    if (column.nullable !== undefined) {
      alters.push(`alter ${column.name.accept(this)} ${column.nullable ? "drop" : "set"} not null`);
    }

    if (column.type !== undefined) {
      alters.push(`alter ${column.name.accept(this)} type ${column.type}`);
    }

    return alters.length > 0
      ? `alter table ${alterColumn.table.accept(this)}\n  ${alters.join(",\n  ")}`
      : "";
  }

  override visitTimestamp(timestamp: SqlTimestamp) {
    return "TIMESTAMP " + super.visitTimestamp(timestamp);
  }
}
