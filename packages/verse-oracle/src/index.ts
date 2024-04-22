import {
  BooleansToOneOrZero,
  DateAsTimestampWithTimeZone,
  DefaultSequence,
  SeqHiloKey,
  UuidPropertyToBuffer,
} from "@operativa/verse/conventions/database";
import {
  Driver,
  DriverInfo,
  ExecuteResult,
  ExecuteStatement,
  IsolationLevel,
} from "@operativa/verse/db/driver";
import { explodeIn } from "@operativa/verse/db/in";
import { SqlPrinter } from "@operativa/verse/db/printer";
import { SqlRewriter } from "@operativa/verse/db/rewriter";
import {
  SqlAlias,
  SqlAlterColumn,
  sqlBin,
  SqlBinary,
  SqlCase,
  SqlColumn,
  SqlExists,
  SqlFunction,
  sqlId,
  SqlIdentifier,
  SqlIn,
  SqlInsert,
  SqlMember,
  SqlNextValue,
  SqlNode,
  SqlNot,
  SqlNumber,
  SqlParameter,
  SqlRaw,
  SqlSelect,
  sqlStr,
  SqlTimestamp,
  SqlType,
} from "@operativa/verse/db/sql";
import { Model, OnDelete } from "@operativa/verse/model/model";
import { notNull } from "@operativa/verse/utils/check";
import { Logger, logSql } from "@operativa/verse/utils/logging";
import { error } from "@operativa/verse/utils/utils";
import { List } from "immutable";
import {
  BIND_OUT,
  Connection,
  ConnectionAttributes,
  createPool,
  getConnection,
  NUMBER,
  Pool,
} from "oracledb";

export function oracle(
  connectionAttributes: ConnectionAttributes,
  adminAttributes?: ConnectionAttributes
) {
  return new OracleDriver(connectionAttributes, adminAttributes);
}

export class OracleDriver implements Driver, AsyncDisposable {
  #pool?: Pool;
  #logger?: Logger | undefined;

  constructor(
    readonly connectionAttributes: ConnectionAttributes,
    readonly adminAttributes?: ConnectionAttributes
  ) {
    notNull({ connectionAttributes });
  }

  get info(): DriverInfo {
    return {
      name: "oracle",
      server: this.connectionAttributes.connectString,
      database: this.connectionAttributes.user!,
    };
  }

  get conventions() {
    return List.of(
      new SeqHiloKey(),
      new BooleansToOneOrZero(),
      new DefaultSequence(),
      new DateAsTimestampWithTimeZone(),
      new UuidPropertyToBuffer()
    );
  }

  // @ts-ignore
  validate(model: Model) {}

  set logger(logger: Logger | undefined) {
    this.#logger = logger;
  }

  private async pool() {
    if (!this.#pool) {
      this.#pool = await createPool({
        ...this.connectionAttributes,
        user: sqlId(this.connectionAttributes.user!).accept(new OraclePrinter()),
      });
    }

    return this.#pool!;
  }

  rows(sql: SqlNode) {
    const printer = new OraclePrinter();

    return (args: unknown[]) => {
      const query = sql.accept(new DialectRewriter(args)).accept(printer);

      return this.#query(query, args);
    };
  }

  async *#query(sql: string, args: readonly unknown[]): AsyncIterable<readonly unknown[]> {
    logSql(sql, args, this.#logger);

    const pool = await this.pool();

    let connection;
    try {
      const bind = {} as any;

      args.forEach((v, i) => (bind[i] = v));

      connection = await pool.getConnection();

      const stream = connection.queryStream(sql, bind);

      for await (const row of stream) {
        yield row as unknown[];
      }
    } finally {
      await connection?.close();
    }
  }

  async execute(
    statements: readonly ExecuteStatement[],
    isolation?: IsolationLevel,
    onCommit?: (results: readonly ExecuteResult[]) => void
  ) {
    const results: ExecuteResult[] = [];

    let connection;

    const pool = await this.pool();

    try {
      connection = await pool.getConnection();

      if (isolation) {
        await connection.execute(`set transaction isolation level ${isolation}`);
      }

      for (const statement of statements) {
        const outBinds: string[] = [];

        const sql = statement.sql
          .accept(new DialectRewriter(statement.args))
          .accept(new OraclePrinter(outBinds));

        const args = statement.args ?? [];
        const bind = {} as any;

        args.forEach((v, i) => (bind[i] = v));
        outBinds.forEach(b => (bind[b] = { dir: BIND_OUT, type: NUMBER }));

        logSql(sql, args, this.#logger);

        statement.onBeforeExecute?.(args);

        const response = await connection.execute(sql, bind);

        const result = {
          rowsAffected: response.rowsAffected!,
          returning: outBinds.map(b => (response.outBinds as any)[b][0]),
        };

        results.push(result);

        statement.onAfterExecute?.(result);
      }

      await connection.commit();

      onCommit?.(results);
    } finally {
      await connection?.close();
    }

    return results;
  }

  script(statements: readonly ExecuteStatement[]) {
    const dialect = new DialectRewriter([]);
    const printer = new OraclePrinter();

    return statements.map(stmt => stmt.sql.accept(dialect).accept(printer));
  }

  async exists() {
    if (!this.adminAttributes) {
      throw new Error("Cannot check for database without admin connection attributes.");
    }

    const user = this.connectionAttributes.user!;
    const ident = sqlId(user).accept(new OraclePrinter());
    const param = user === ident ? user.toUpperCase() : user;

    const sql = `select 1 from all_users where username = :0`;
    const args = [param];

    logSql(sql, args, this.#logger);

    let connection: Connection | undefined;

    try {
      connection = await getConnection(this.adminAttributes);

      // noinspection LoopStatementThatDoesntLoopJS
      for await (const _ of connection.queryStream(sql, args)) {
        return true;
      }

      return false;
    } finally {
      await connection?.close();
    }
  }

  static readonly #TABLE_EXISTS = new SqlSelect({
    projection: SqlNumber.ONE,
    from: sqlId("all_tables"),
    where: sqlBin(sqlId("table_name"), "=", new SqlParameter(0)),
  });

  async tableExists(name: string) {
    // noinspection LoopStatementThatDoesntLoopJS
    for await (const _ of this.rows(OracleDriver.#TABLE_EXISTS)([name])) {
      return true;
    }

    return false;
  }

  async create() {
    if (!this.adminAttributes) {
      throw new Error("Cannot create a database without admin connection attributes.");
    }

    let connection: Connection | undefined;

    try {
      connection = await getConnection(this.adminAttributes);

      const printer = new OraclePrinter();
      const user = sqlId(this.connectionAttributes.user!).accept(printer);
      const password = sqlId(this.connectionAttributes.password!).accept(printer);

      const ops = [
        `create user ${user} identified by ${password}`,
        `grant create session to ${user}`,
        `grant create table to ${user}`,
        `grant create sequence to ${user}`,
        `grant unlimited tablespace to ${user}`,
      ];

      for (const sql of ops) {
        logSql(sql, [], this.#logger);

        await connection!.execute(sql);
      }
    } finally {
      await connection?.close();
    }
  }

  async drop() {
    if (!(await this.exists())) {
      return;
    }

    if (!this.adminAttributes) {
      throw new Error("Cannot drop a database without admin connection attributes.");
    }

    const user = sqlId(this.connectionAttributes.user!).accept(new OraclePrinter());
    const sql = `drop user ${user} cascade`;

    logSql(sql, [], this.#logger);

    let connection: Connection | undefined;

    try {
      connection = await getConnection(this.adminAttributes);

      await connection.execute(sql);
    } finally {
      await connection?.close();
    }
  }

  async [Symbol.asyncDispose]() {
    return await this.#pool?.close();
  }
}

class DialectRewriter extends SqlRewriter {
  constructor(private args: unknown[] = []) {
    super();
  }

  override visitSelect(select: SqlSelect) {
    let newSelect = super.visitSelect(select) as SqlSelect;

    const newProjection = newSelect.projection.map(n => this.#selectBoolean(n));

    newSelect = newSelect.withProjection(newProjection);

    if (!newSelect.from) {
      newSelect = newSelect.withFrom(new SqlIdentifier("DUAL"));
    }

    if (newSelect.where) {
      const where = this.#whereBoolean(newSelect.where);

      newSelect = newSelect.withWhere(where);
    }

    return newSelect;
  }

  #selectBoolean(node: SqlNode) {
    if (node instanceof SqlNot || node instanceof SqlExists) {
      return new SqlCase(node, SqlNumber.ONE, SqlNumber.ZERO);
    }

    return node;
  }

  override visitBinary(binary: SqlBinary) {
    const newBinary = super.visitBinary(binary) as SqlBinary;

    if (newBinary.op === "%") {
      return new SqlFunction("MOD", List.of(newBinary.left, newBinary.right));
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

  override visitNot(not: SqlNot) {
    const operand = this.#whereBoolean(not.operand);

    if (operand !== not.operand) {
      return new SqlNot(operand);
    }

    return not;
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

  override visitFunction(func: SqlFunction) {
    if (func.name === "now") {
      return new SqlRaw(List.of("SYSDATE"));
    }

    if (func.name === "nextval") {
      return new SqlMember(func.args.get(0)!, sqlId("nextval"));
    }

    return super.visitFunction(func);
  }

  override visitIn(_in: SqlIn) {
    if (this.args.length > 0) {
      return explodeIn(_in, this.args);
    }

    return _in;
  }

  override visitNextValue(nextValue: SqlNextValue) {
    return new SqlMember(nextValue.sequence, sqlId("nextval"));
  }

  override visitColumn(column: SqlColumn) {
    const newColumn = super.visitColumn(column) as SqlColumn;

    if (newColumn.type === "uuid") {
      return newColumn.withType("binary(16)");
    }

    return newColumn;
  }
}

const keywords = new Set([
  "ACCESS",
  "ELSE",
  "MODIFY",
  "START",
  "ADD",
  "EXCLUSIVE",
  "NOAUDIT",
  "SELECT",
  "ALL",
  "EXISTS",
  "NOCOMPRESS",
  "SESSION",
  "ALTER",
  "FILE",
  "NOT",
  "SET",
  "AND",
  "FLOAT",
  "NOTFOUND",
  "SHARE",
  "ANY",
  "FOR",
  "NOWAIT",
  "SIZE",
  "ARRAYLEN",
  "FROM",
  "NULL",
  "SMALLINT",
  "AS",
  "GRANT",
  "NUMBER",
  "SQLBUF",
  "ASC",
  "GROUP",
  "OF",
  "SUCCESSFUL",
  "AUDIT",
  "HAVING",
  "OFFLINE",
  "SYNONYM",
  "BETWEEN",
  "IDENTIFIED",
  "ON",
  "SYSDATE",
  "BY",
  "IMMEDIATE",
  "ONLINE",
  "TABLE",
  "CHAR",
  "IN",
  "OPTION",
  "THEN",
  "CHECK",
  "INCREMENT",
  "OR",
  "TO",
  "CLUSTER",
  "INDEX",
  "ORDER",
  "TRIGGER",
  "COLUMN",
  "INITIAL",
  "PCTFREE",
  "UID",
  "COMMENT",
  "INSERT",
  "PRIOR",
  "UNION",
  "COMPRESS",
  "INTEGER",
  "PRIVILEGES",
  "UNIQUE",
  "CONNECT",
  "INTERSECT",
  "PUBLIC",
  "UPDATE",
  "CREATE",
  "INTO",
  "RAW",
  "USER",
  "CURRENT",
  "IS",
  "RENAME",
  "VALIDATE",
  "DATE",
  "LEVEL",
  "RESOURCE",
  "VALUES",
  "DECIMAL",
  "LIKE",
  "REVOKE",
  "VARCHAR",
  "DEFAULT",
  "LOCK",
  "ROW",
  "VARCHAR2",
  "DELETE",
  "LONG",
  "ROWID",
  "VIEW",
  "DESC",
  "MAXEXTENTS",
  "ROWLABEL",
  "WHENEVER",
  "DISTINCT",
  "MINUS",
  "ROWNUM",
  "WHERE",
  "DROP",
  "MODE",
  "ROWS",
  "WITH",
]);

class OraclePrinter extends SqlPrinter {
  constructor(readonly outBinds: string[] = []) {
    super();
  }

  override visitFunction(func: SqlFunction) {
    return `${func.name}(${this.visitFunctionArgs(func.args)}${func.name === "json_arrayagg" ? " returning varchar2(32767)" : ""})`;
  }

  override visitAlterColumn(alterColumn: SqlAlterColumn): string {
    let sql = "";

    const column = alterColumn.column;

    if (column.identity) {
      error(
        "Oracle does not support adding identity to existing columns. Use raw SQL to recreate the column."
      );
    } else {
      if (column.type) {
        sql += ` ${this.visitType(column.type)}`;
      }

      if (column.nullable !== undefined) {
        sql += column.nullable ? "null" : " not null";
      }

      if (column.default) {
        sql += ` default ${column.default.accept(this)}`;
      }

      if (column.identity === false) {
        sql += " drop identity";
      }
    }

    return `alter table ${alterColumn.table.accept(this)} modify ${column.name.accept(this)}${sql}`;
  }

  override visitColumn(column: SqlColumn): string {
    return `${column.name.accept(this)} ${column.type ? this.visitType(column.type) : ""}${
      column.identity === true
        ? " generated by default on null as identity"
        : column.default
          ? ` default ${column.default.accept(this)}`
          : column.nullable === false
            ? " not null"
            : ""
    }`;
  }

  protected override visitOnDelete(onDelete?: OnDelete) {
    return onDelete && onDelete !== "no action" ? ` on delete ${onDelete}` : "";
  }

  protected override visitReturning(insert: SqlInsert) {
    return (
      ` returning ${insert.returning.map(r => r.accept(this)).join(", ")} into ` +
      `${insert.returning
        .map((_, i) => {
          const out = `out${i}`;

          this.outBinds.push(out);

          return `:${out}`;
        })
        .join(", ")}`
    );
  }

  protected override visitType(type: SqlType) {
    if (type.startsWith("binary")) {
      return type.replace("binary", "raw");
    }

    if (type === "text") {
      return "clob";
    }

    if (type === "boolean") {
      return "number(1)";
    }

    return super.visitType(type);
  }

  override visitParameter(parameter: SqlParameter) {
    return `:${parameter.id}`;
  }

  override visitAlias(alias: SqlAlias): string {
    return `${this.parens(alias.target)} ${alias.alias.accept(this)}`;
  }

  override visitLimit(limit: SqlNode) {
    return `\nfetch next ${limit.accept(this)} rows only`;
  }

  override visitOffset(offset: SqlNode) {
    return `\noffset ${offset.accept(this)} rows`;
  }

  override visitIdentifier(identifier: SqlIdentifier) {
    const escaped = this.escapeIdent(identifier.name);

    return escaped === identifier.name &&
      !this.isKeyword(escaped) &&
      !escaped.startsWith("_") &&
      !/['.]/.test(escaped)
      ? escaped
      : `"${escaped}"`;
  }

  override visitTimestamp(timestamp: SqlTimestamp): string {
    return `TIMESTAMP ${super.visitTimestamp(timestamp).replace("T", " ").replace("Z", " UTC")}`;
  }

  protected isKeyword(name: string) {
    return keywords.has(name.toUpperCase());
  }
}
