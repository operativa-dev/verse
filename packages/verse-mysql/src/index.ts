import { Convention } from "@operativa/verse/conventions/convention";
import {
  BooleansToOneOrZero,
  DateAsTimestamp,
  IdentityKey,
  UuidPropertyToBuffer,
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
  SqlComposite,
  SqlCreateDatabase,
  SqlDropDatabase,
  SqlDropIndex,
  SqlFunction,
  sqlId,
  SqlIdentifier,
  SqlInsert,
  SqlMember,
  SqlNode,
  SqlNumber,
  SqlParameter,
  SqlSelect,
  sqlStr,
  SqlString,
} from "@operativa/verse/db/sql";
import { KeyModel } from "@operativa/verse/model/model";
import { notEmpty } from "@operativa/verse/utils/check";
import { logBatch, Logger, logSql } from "@operativa/verse/utils/logging";
import { List } from "immutable";
import my, { ConnectionConfig, ResultSetHeader } from "mysql2/promise.js";

export function mysql(connectionString: string) {
  return new MySqlDriver(connectionString);
}

export class MySqlDriver implements Driver, AsyncDisposable {
  readonly #pool: my.Pool;
  #logger?: Logger | undefined;

  constructor(connectionString: string) {
    notEmpty({ connectionString });

    this.#pool = my.createPool({
      uri: connectionString,
      multipleStatements: true,
      rowsAsArray: true,
      timezone: "Z",
    });
  }

  get info() {
    return {
      name: "mysql",
      server: this.#config.host,
      database: this.#config.database!,
    };
  }

  set logger(logger: Logger | undefined) {
    this.#logger = logger;
  }

  get conventions(): List<Convention> {
    return List.of(
      new IdentityKey(),
      new UuidPropertyToBuffer(),
      new BooleansToOneOrZero(),
      new DateAsTimestamp()
    );
  }

  rows(sql: SqlNode) {
    const printer = new MySqlPrinter();
    const dialect = new DialectRewriter();

    const query = sql.accept(dialect).accept(printer);

    return (args: unknown[]) => this.#query(query, args, printer.argsMap, dialect.coerceArgs);
  }

  async *#query(
    sql: string,
    args: unknown[],
    argsMap: number[],
    coerceArgs: Set<number>
  ): AsyncIterable<unknown[]> {
    logSql(sql, args, this.#logger);

    const [rows, _] = await this.#pool.execute(
      sql,
      argsMap.map(i => (coerceArgs.has(i) ? String(args[i]) : args[i]))
    );

    for (const r of rows as unknown[][]) {
      yield r;
    }
  }

  async execute(
    statements: ExecuteStatement[],
    isolation?: IsolationLevel,
    onBeforeCommit?: (results: ExecuteResult[]) => void
  ) {
    const dialect = new DialectRewriter();

    const batch = statements.map(stmt => {
      const [dml, select] = this.#selectBack(stmt.sql);

      let printer = new MySqlPrinter(false);
      let sql = dml.accept(dialect).accept(printer);

      const args: unknown[] = [];

      if (stmt.args) {
        args.push(...printer.argsMap.map(i => stmt.args![i]));
      }

      if (select) {
        printer = new MySqlPrinter(false);
        sql += ";\n" + select.accept(printer);

        if (stmt.args) {
          args.push(...printer.argsMap.map(i => stmt.args![i]));
        }
      }

      return {
        ...stmt,
        sql,
        args,
      };
    });

    logBatch(batch, this.#logger);

    const results: ExecuteResult[] = [];

    const conn = await this.#pool.getConnection();

    try {
      if (isolation) {
        if (isolation === "snapshot") {
          throw new Error("Snapshot isolation is not supported by MySql.");
        }

        await conn.query(`set session transaction isolation level ${isolation}`);
      }

      await conn.beginTransaction();

      for (const op of batch) {
        op.onBeforeExecute?.(op.args);

        const [rows, _] = await conn.query(op.sql, op.args);

        let returning: unknown[] = [];
        let rowsAffected = 0;

        if ("affectedRows" in rows) {
          rowsAffected = rows.affectedRows;
        } else if (Array.isArray(rows)) {
          let i = 0;

          while (i < rows.length) {
            const header = rows[i++]! as ResultSetHeader;
            rowsAffected = header.affectedRows;

            if (Array.isArray(rows[i])) {
              const rowData = rows[i++] as Array<unknown[]>;

              returning = rowData[0]!;
            }
          }
        }

        const result = { rowsAffected, returning };

        results.push(result);

        op.onAfterExecute?.(result);
      }

      onBeforeCommit?.(results);

      await conn.commit();
    } finally {
      conn.release();
    }

    return results;
  }

  readonly #lastInsertId = new SqlFunction("last_insert_id");

  #selectBack(node: SqlNode): [dml: SqlNode, select?: SqlNode] {
    if (node instanceof SqlInsert && !node.returning.isEmpty()) {
      const key = node.binding?.model as KeyModel;

      const where = key.properties
        .map(p => {
          let lhs: SqlNode;
          let rhs: SqlNode;

          let index = node.columns.findIndex(c => c.name === p.column!);

          if (index !== -1) {
            lhs = node.columns.get(index)!;
            rhs = node.values.get(index)!;
          } else {
            lhs = sqlId(p.column!);
            rhs = this.#lastInsertId;
          }

          return sqlBin(lhs, "=", rhs);
        })
        .reduce((acc: SqlNode, next) => (acc ? sqlBin(acc, "and", next) : next));

      return [
        node.withReturning(List()),
        new SqlSelect({
          projection: new SqlComposite(node.returning),
          from: node.table,
          where,
        }),
      ];
    }

    return [node];
  }

  script(statements: ExecuteStatement[]) {
    const dialect = new DialectRewriter();
    const printer = new MySqlPrinter();

    return statements.map(stmt => stmt.sql.accept(dialect).accept(printer));
  }

  exists() {
    return this.#usingSystemDb(async mysql => this.#exists(mysql));
  }

  static readonly #EXISTS = new SqlSelect({
    projection: new SqlNumber(1),
    from: new SqlMember(sqlId("information_schema"), sqlId("schemata")),
    where: sqlBin(sqlId("schema_name"), "=", new SqlParameter(0)),
  });

  async #exists(mysql: MySqlDriver) {
    // noinspection LoopStatementThatDoesntLoopJS
    for await (const _ of mysql.rows(MySqlDriver.#EXISTS)([this.#config.database!])) {
      return true;
    }

    return false;
  }

  async tableExists(name: string) {
    notEmpty({ name });

    // noinspection LoopStatementThatDoesntLoopJS
    for await (const _ of this.rows(
      new SqlSelect({
        projection: new SqlNumber(1),
        from: new SqlMember(sqlId("information_schema"), sqlId("tables")),
        where: sqlBin(
          sqlBin(sqlId("table_schema"), "=", sqlStr(this.#config.database!)),
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
    return this.#usingSystemDb(async mysql => {
      const sql = new SqlCreateDatabase(sqlId(this.#config.database!)).accept(new MySqlPrinter());

      logSql(sql, [], this.#logger);

      await mysql.#pool.query(sql);
    });
  }

  async drop() {
    return this.#usingSystemDb(async mysql => {
      if (!(await this.#exists(mysql))) {
        return;
      }

      const sql = new SqlDropDatabase(sqlId(this.#config.database!)).accept(new MySqlPrinter());

      logSql(sql, [], this.#logger);

      await mysql.#pool.query(sql);
    });
  }

  async #usingSystemDb<T>(block: (mysql: MySqlDriver) => Promise<T>): Promise<T> {
    const db = this.#systemDb();

    try {
      return await block(db);
    } finally {
      await db[Symbol.asyncDispose]();
    }
  }

  #systemDb() {
    const c = this.#config;
    const driver = mysql(`mysql://${c.user}:${c.password}@${c.host}:${c.port}/mysql`);
    driver.logger = this.#logger;

    return driver;
  }

  get #config() {
    const config = this.#pool.pool.config as any;
    // noinspection JSUnresolvedReference
    return config.connectionConfig as ConnectionConfig;
  }

  [Symbol.asyncDispose]() {
    return this.#pool.end();
  }
}

class DialectRewriter extends SqlRewriter {
  #coerceArgs: Set<number> = new Set<number>();

  get coerceArgs() {
    return this.#coerceArgs;
  }

  override visitBinary(binary: SqlBinary): SqlNode {
    const newBinary = super.visitBinary(binary) as SqlBinary;

    switch (newBinary.op) {
      case "||":
        return new SqlFunction("concat", List.of(newBinary.left, newBinary.right));
      case "->":
      case "->>":
        if (newBinary.right instanceof SqlNumber) {
          let left = newBinary.left;
          let path = "$";

          if (newBinary.left instanceof SqlBinary && SqlBinaryOperator.isJson(newBinary.left.op)) {
            left = newBinary.left.left;
            path = (newBinary.left.right as SqlString).value;
          }

          let result = new SqlFunction(
            "json_extract",
            List.of(left, sqlStr(`${path}[${newBinary.right.value}]`))
          );

          if (newBinary.op === "->>") {
            result = new SqlFunction("json_unquote", List.of(result));
          }

          return result;
        }
    }

    return newBinary;
  }

  override visitSelect(select: SqlSelect) {
    const newSelect = super.visitSelect(select) as SqlSelect;

    if (newSelect.limit && newSelect.limit instanceof SqlParameter) {
      this.#coerceArgs.add(newSelect.limit.id);
    }

    if (newSelect.offset && newSelect.offset instanceof SqlParameter) {
      this.#coerceArgs.add(newSelect.offset.id);
    }

    return newSelect;
  }

  override visitColumn(column: SqlColumn) {
    const newColumn = super.visitColumn(column) as SqlColumn;

    if (newColumn.type === "uuid") {
      return newColumn.withType("binary(16)");
    }

    return newColumn;
  }
}

class MySqlPrinter extends SqlPrinter {
  #argsMap: number[] = [];

  constructor(prettySelect = true) {
    super(prettySelect);
  }

  get argsMap(): number[] {
    return this.#argsMap;
  }

  override visitDropIndex(dropIndex: SqlDropIndex): string {
    return super.visitDropIndex(dropIndex) + ` on ${dropIndex.table?.accept(this)}`;
  }

  override visitColumn(column: SqlColumn) {
    let sql = super.visitColumn(column);

    if (column.identity) {
      sql += " auto_increment";
    }

    return sql;
  }

  protected override visitOffset(offset: SqlNode) {
    return `\nlimit 18446744073709551615 offset ${offset.accept(this)}`;
  }

  override visitParameter(parameter: SqlParameter) {
    this.#argsMap.push(parameter.id);

    return "?";
  }

  override visitIdentifier(identifier: SqlIdentifier) {
    return "`" + this.escapeIdent(identifier.name) + "`";
  }

  protected override escapeIdent(identifier: string) {
    return identifier.replace(/`/g, "``");
  }

  protected override escapeString(str: string) {
    return str.replace(/(['\\])/g, "\\$1");
  }
}
