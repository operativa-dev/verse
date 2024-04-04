import {
  BooleansToOneOrZero,
  DateAsTimestampWithTimeZone,
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
  SqlBinary,
  SqlColumn,
  SqlCreateDatabase,
  SqlDropDatabase,
  SqlDropIndex,
  SqlExists,
  SqlFunction,
  sqlId,
  SqlIdentifier,
  SqlIn,
  SqlInsert,
  SqlMember,
  SqlNode,
  SqlNot,
  SqlNumber,
  SqlOrderBy,
  SqlOrdering,
  SqlParameter,
  SqlRaw,
  SqlRenameColumn,
  SqlRenameTable,
  SqlSelect,
  SqlSet,
  sqlStr,
  SqlType,
} from "@operativa/verse/db/sql";
import { KeyModel } from "@operativa/verse/model/model";
import { notEmpty, notNull } from "@operativa/verse/utils/check";
import { logBatch, Logger, logSql } from "@operativa/verse/utils/logging";
import { List } from "immutable";
import { config, connect, ConnectionPool, ISOLATION_LEVEL } from "mssql";

export function mssql(config: config) {
  return new MssqlDriver(config);
}

export class MssqlDriver implements Driver {
  #pool?: ConnectionPool;
  #logger?: Logger | undefined;

  constructor(readonly config: config) {
    notNull({ config });

    config.arrayRowMode = true;
  }

  get info() {
    return {
      name: "mssql",
      server: this.config.server,
      database: this.config.database!,
    };
  }

  set logger(logger: Logger | undefined) {
    this.#logger = logger;
  }

  get conventions() {
    return List.of(new IdentityKey(), new BooleansToOneOrZero(), new DateAsTimestampWithTimeZone());
  }

  private async pool() {
    if (!this.#pool) {
      this.#pool = await connect(this.config);
    }

    return this.#pool!;
  }

  rows(sql: SqlNode) {
    const printer = new MssqlPrinter();

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

  async *#query(sql: string, args: readonly unknown[]): AsyncIterable<readonly unknown[]> {
    logSql(sql, args, this.#logger);

    const pool = await this.pool();
    const request = pool.request();

    args.forEach((arg, i) => request.input(`p${i}`, arg));

    const result = await request.query(sql);

    for (const row of result.recordset) {
      yield row as unknown[];
    }
  }

  async execute(
    statements: readonly ExecuteStatement[],
    isolation?: IsolationLevel,
    onBeforeCommit?: (results: readonly ExecuteResult[]) => void
  ) {
    const batch = this.#createBatch(statements);

    logBatch(batch, this.#logger);

    const results: ExecuteResult[] = [];

    const pool = await this.pool();

    const transaction = pool.transaction();
    await transaction.begin(this.#mapIsolation(isolation));

    for (const op of batch) {
      op.onBeforeExecute?.(op.args);

      const request = transaction.request();

      op.args.forEach((arg, i) => request.input(`p${i}`, arg));

      const response = await request.query(op.sql);

      const result = {
        rowsAffected: response.rowsAffected[0]!,
        returning: response.recordset?.[0] ?? [],
      };

      results.push(result);

      op.onAfterExecute?.(result);
    }

    await transaction.commit();

    onBeforeCommit?.(results);

    return results;
  }

  #createBatch(statements: readonly ExecuteStatement[]) {
    const dialect = new DialectRewriter();
    const printer = new MssqlPrinter();

    const batch = [];

    let identityTable: SqlIdentifier | undefined;

    for (const stmt of statements) {
      if (stmt.sql instanceof SqlInsert && stmt.sql.binding?.model instanceof KeyModel) {
        const identity = stmt.sql.binding.model.properties.find(p => p.storeGenerated);

        if (stmt.sql.columns.some(c => c.name === identity?.column)) {
          identityTable = stmt.sql.table;
        }
      }

      let sql = stmt.sql.accept(dialect).accept(printer);

      if (identityTable) {
        sql =
          this.#setIdentityInsert(identityTable, "on").accept(printer) +
          "\n" +
          sql +
          "\n" +
          this.#setIdentityInsert(identityTable, "off").accept(printer);

        identityTable = undefined;
      }

      batch.push({ ...stmt, sql, args: stmt.args ?? [] });
    }

    return batch;
  }

  #setIdentityInsert(table: SqlIdentifier, value: "on" | "off") {
    return new SqlSet("identity_insert", table, new SqlRaw(List.of(value)));
  }

  script(statements: readonly ExecuteStatement[]) {
    const dialect = new DialectRewriter();
    const printer = new MssqlPrinter();

    return statements.map(stmt => stmt.sql.accept(dialect).accept(printer));
  }

  #mapIsolation(isolation?: IsolationLevel) {
    switch (isolation) {
      case "read uncommitted":
        return ISOLATION_LEVEL.READ_UNCOMMITTED;
      case "read committed":
        return ISOLATION_LEVEL.READ_COMMITTED;
      case "repeatable read":
        return ISOLATION_LEVEL.REPEATABLE_READ;
      case "snapshot":
        return ISOLATION_LEVEL.SNAPSHOT;
      case "serializable":
        return ISOLATION_LEVEL.SERIALIZABLE;
      default:
        return undefined;
    }
  }

  exists() {
    return this.#usingSystemDb(async db => this.#exists(db));
  }

  static readonly #EXISTS = new SqlSelect({
    projection: SqlNumber.ONE,
    from: new SqlMember(sqlId("sys"), sqlId("databases")),
    where: sqlBin(sqlId("name"), "=", new SqlParameter(0)),
  });

  async #exists(db: MssqlDriver) {
    // noinspection LoopStatementThatDoesntLoopJS
    for await (const _ of db.rows(MssqlDriver.#EXISTS)([this.config.database])) {
      return true;
    }

    return false;
  }

  async tableExists(name: string) {
    notEmpty({ name });

    // noinspection LoopStatementThatDoesntLoopJS
    for await (const _ of this.rows(
      new SqlSelect({
        projection: SqlNumber.ONE,
        from: new SqlMember(sqlId("information_schema"), sqlId("tables")),
        where: sqlBin(
          sqlBin(sqlId("table_schema"), "=", sqlStr(this.config.database!)),
          "and",
          sqlBin(sqlId("table_name"), "=", new SqlParameter(0))
        ),
      })
    )([name])) {
      return true;
    }

    return false;
  }

  async create() {
    return this.#usingSystemDb(async db => {
      const sql = new SqlCreateDatabase(sqlId(this.config.database!)).accept(new MssqlPrinter());

      logSql(sql, [], this.#logger);

      const pool = await db.pool();
      await pool.batch(sql);
    });
  }

  async drop() {
    return this.#usingSystemDb(async db => {
      if (!(await this.#exists(db))) {
        return;
      }

      const sql = new SqlDropDatabase(sqlId(this.config.database!)).accept(new MssqlPrinter());

      logSql(sql, [], this.#logger);

      const pool = await db.pool();
      await pool.batch(sql);
    });
  }

  async #usingSystemDb<T>(block: (db: MssqlDriver) => Promise<T>) {
    const db = this.#systemDb();

    try {
      return await block(db);
    } finally {
      await db[Symbol.asyncDispose]();
    }
  }

  #systemDb() {
    const driver = mssql({ ...this.config, database: "master" });
    driver.logger = this.#logger;

    return driver;
  }

  [Symbol.asyncDispose]() {
    return this.#pool?.close();
  }
}

class DialectRewriter extends SqlRewriter {
  #selectDepth = 0;

  constructor(private args: unknown[] = []) {
    super();
  }

  override visitIn(_in: SqlIn) {
    if (this.args.length > 0) {
      return explodeIn(_in, this.args);
    }

    return _in;
  }

  override visitSelect(select: SqlSelect) {
    this.#selectDepth++;

    let newSelect = super.visitSelect(select) as SqlSelect;

    this.#selectDepth--;

    const newProjection = newSelect.projection.map(n => this.#selectBoolean(n));

    if (newProjection !== newSelect.projection) {
      newSelect = newSelect.withProjection(newProjection);
    }

    if (newSelect.offset !== undefined || newSelect.limit !== undefined) {
      let orderBy = newSelect.orderBy;

      if (!orderBy) {
        orderBy = new SqlOrderBy(List.of(new SqlOrdering(SqlNumber.ONE)));
      }

      newSelect = newSelect
        .withOrderBy(
          new SqlOrderBy(orderBy.expressions, newSelect.offset ?? SqlNumber.ZERO, newSelect.limit)
        )
        .withLimit(undefined)
        .withOffset(undefined);
    } else if (newSelect.orderBy && this.#selectDepth > 0) {
      newSelect = newSelect.withOrderBy(
        new SqlOrderBy(newSelect.orderBy.expressions, SqlNumber.ZERO)
      );
    }

    if (newSelect.where) {
      const where = this.#whereBoolean(newSelect.where);

      newSelect = newSelect.withWhere(where);
    }

    return newSelect;
  }

  override visitFunction(func: SqlFunction) {
    const newFunction = super.visitFunction(func) as SqlFunction;

    if (newFunction.name === "substr") {
      return new SqlFunction(
        "substring",
        newFunction.args.size == 2
          ? List.of(newFunction.args.get(0)!, newFunction.args.get(1)!, new SqlNumber(2147483647))
          : newFunction.args
      );
    }

    if (newFunction.name === "now") {
      return new SqlFunction("getdate");
    }

    if (newFunction.name === "length") {
      return new SqlFunction("len", newFunction.args);
    }

    if (newFunction.name === "json_arrayagg") {
      let args = newFunction.args;

      if (args.size === 1) {
        let arg = args.get(0)!;

        if (arg instanceof SqlMember) {
          // trim('[]' from json_modify('[]', 'append $', "t4"."ArtistId"))

          arg = new SqlFunction(
            "trim",
            List.of<SqlNode>(
              sqlStr("[]"),
              new SqlFunction(
                "json_modify",
                List.of<SqlNode>(sqlStr("[]"), sqlStr("append $"), arg)
              )
            )
          );

          args = List.of(arg);
        }
      }

      return sqlBin(
        sqlStr("["),
        "+",
        sqlBin(new SqlFunction("string_agg", args.concat(sqlStr(","))), "+", sqlStr("]"))
      );
    }

    return newFunction;
  }

  override visitNot(not: SqlNot) {
    const operand = this.#whereBoolean(not.operand);

    if (operand !== not.operand) {
      return new SqlNot(operand);
    }

    return not;
  }

  override visitBinary(binary: SqlBinary) {
    const newBinary = super.visitBinary(binary) as SqlBinary;

    if (newBinary.op === "||") {
      return sqlBin(newBinary.left, "+", newBinary.right);
    }

    if (newBinary.op === "and" || newBinary.op === "or") {
      const left = this.#whereBoolean(newBinary.left);
      const right = this.#whereBoolean(newBinary.right);

      if (left !== newBinary.left || right !== newBinary.right) {
        return sqlBin(left, newBinary.op, right);
      }
    }

    if (newBinary.op === "->" || newBinary.op === "->>") {
      const number = newBinary.right as SqlNumber;

      return new SqlFunction("json_query", List.of(newBinary.left, sqlStr(`$[${number.value}]`)));
    }

    return newBinary;
  }

  #whereBoolean(node: SqlNode) {
    if (node instanceof SqlMember) {
      const member = node as SqlMember;
      const identifier = member.member as SqlIdentifier;

      if (identifier.type === "boolean") {
        return sqlBin(member, "=", SqlNumber.ONE);
      }
    }

    return node;
  }

  #selectBoolean(node: SqlNode) {
    if (node instanceof SqlNot || node instanceof SqlExists) {
      return new SqlFunction("iif", List.of<SqlNode>(node, SqlNumber.ONE, SqlNumber.ZERO));
    }

    return node;
  }
}

class MssqlPrinter extends SqlPrinter {
  constructor() {
    super();
  }

  override visitDropIndex(dropIndex: SqlDropIndex): string {
    return `drop index ${dropIndex.table.accept(this)}.${dropIndex.name.accept(this)}`;
  }

  override visitRenameTable(renameTable: SqlRenameTable): string {
    return `sp_rename ${sqlStr(renameTable.oldName.name).accept(this)}, ${sqlStr(
      renameTable.newName.name
    ).accept(this)}`;
  }

  override visitRenameColumn(renameColumn: SqlRenameColumn): string {
    return `sp_rename ${sqlStr(`${renameColumn.table.name}.${renameColumn.oldName.name}`).accept(
      this
    )}, ${renameColumn.newName.accept(this)}, 'COLUMN'`;
  }

  override visitFunction(func: SqlFunction): string {
    if (func.name === "trim" && func.args.size === 2) {
      return `trim(${func.args.get(0)!.accept(this)} from ${func.args.get(1)!.accept(this)})`;
    }

    return super.visitFunction(func);
  }

  override visitColumn(column: SqlColumn) {
    let sql = super.visitColumn(column);

    if (column.identity) {
      sql += " identity";
    }

    return sql;
  }

  protected override visitType(type: SqlType) {
    if (type === "boolean") {
      return "bit";
    }

    if (type === "timestamp with time zone") {
      return "datetimeoffset";
    }

    return type === "uuid" ? "uniqueidentifier" : super.visitType(type);
  }

  override visitInsert(insert: SqlInsert): string {
    let sql = `insert into ${insert.table.accept(this)} (${insert.columns
      .map(c => c.accept(this))
      .join(", ")})`;

    if (!insert.returning.isEmpty()) {
      sql += ` output ${insert.returning.map(r => `inserted.${r.accept(this)}`).join(", ")}`;
    }

    sql += ` values (${insert.values.map(c => c.accept(this)).join(", ")})`;

    return sql;
  }

  override visitParameter(parameter: SqlParameter) {
    return `@p${parameter.id}`;
  }
}
