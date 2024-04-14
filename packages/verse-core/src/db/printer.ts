import { List } from "immutable";
import { OnDelete } from "../model/model.js";
import { indent } from "../utils/utils.js";
import {
  SqlAddColumn,
  SqlAddForeignKey,
  SqlAlias,
  SqlBinary,
  SqlBoolean,
  SqlCase,
  SqlColumn,
  SqlComposite,
  SqlCreateDatabase,
  SqlCreateIndex,
  SqlCreateSequence,
  SqlCreateTable,
  SqlDelete,
  SqlDropColumn,
  SqlDropDatabase,
  SqlDropIndex,
  SqlDropSequence,
  SqlExists,
  SqlForeignKey,
  SqlFunction,
  SqlIdentifier,
  SqlIn,
  SqlInsert,
  SqlIsNotNull,
  SqlIsNull,
  SqlJoin,
  SqlLike,
  SqlMember,
  SqlNegation,
  SqlNode,
  SqlNot,
  SqlNotLike,
  SqlNull,
  SqlNumber,
  SqlOrderBy,
  SqlOrdering,
  SqlParameter,
  SqlRaw,
  SqlRenameColumn,
  SqlRenameTable,
  SqlSelect,
  SqlSet,
  SqlStar,
  SqlString,
  SqlTimestamp,
  SqlType,
  SqlTypeAlias,
  SqlUpdate,
} from "./sql.js";
import { SqlVisitor } from "./visitor.js";

export class SqlPrinter extends SqlVisitor<string> {
  readonly #clauseSep: string;

  #indent = 0;

  constructor(prettySelect = true) {
    super();
    this.#clauseSep = prettySelect ? "\n" : " ";
  }

  override visitNode(node: SqlNode): string {
    throw new Error(`'visit${node.constructor.name.slice(3)}' is not implemented!`);
  }

  override visitSet(set: SqlSet): string {
    return `set ${set.setting} ${set.arg0?.accept(this)} ${set.arg1?.accept(this)}`;
  }

  override visitCreateDatabase(createDatabase: SqlCreateDatabase): string {
    return `create database ${createDatabase.name.accept(this)}`;
  }

  override visitDropDatabase(dropDatabase: SqlDropDatabase): string {
    return `drop database ${dropDatabase.name.accept(this)}`;
  }

  override visitCreateTable(createTable: SqlCreateTable): string {
    let sql = `create table ${createTable.name.accept(this)} (\n${createTable.columns
      .map(c => "  " + c.accept(this))
      .join(",\n")}`;

    if (!createTable.primaryKey.isEmpty()) {
      sql += `,\n  primary key (${createTable.primaryKey.map(c => c.accept(this)).join(", ")})`;
    }

    if (!createTable.foreignKeys.isEmpty()) {
      sql += `,\n  ${createTable.foreignKeys.map(c => c.accept(this)).join(",\n  ")}`;
    }

    return sql + "\n)";
  }

  override visitDropTable(dropTable: SqlDropDatabase): string {
    return `drop table ${dropTable.name.accept(this)}`;
  }

  override visitRenameTable(renameTable: SqlRenameTable): string {
    return `alter table ${renameTable.oldName.accept(this)} rename to ${renameTable.newName.accept(
      this
    )}`;
  }

  override visitCreateIndex(createIndex: SqlCreateIndex): string {
    return `create index ${createIndex.name.accept(this)} on ${createIndex.table.accept(
      this
    )} (${createIndex.columns.map(c => c.accept(this)).join(", ")})`;
  }

  override visitDropIndex(dropIndex: SqlDropIndex): string {
    return `drop index ${dropIndex.name.accept(this)}`;
  }

  override visitCreateSequence(createSequence: SqlCreateSequence): string {
    return `create sequence ${createSequence.name.accept(
      this
    )} start with ${createSequence.start.accept(
      this
    )} increment by ${createSequence.increment.accept(this)}`;
  }

  override visitDropSequence(dropSequence: SqlDropSequence): string {
    return `drop sequence ${dropSequence.name.accept(this)}`;
  }

  override visitAddColumn(addColumn: SqlAddColumn): string {
    return `alter table ${addColumn.table.accept(this)} add ${addColumn.column.accept(this)}`;
  }

  override visitDropColumn(dropColumn: SqlDropColumn): string {
    return `alter table ${dropColumn.table.accept(this)} drop column ${dropColumn.column.accept(
      this
    )}`;
  }

  override visitRenameColumn(renameColumn: SqlRenameColumn): string {
    return `alter table ${renameColumn.table.accept(
      this
    )} rename column ${renameColumn.oldName.accept(this)} to ${renameColumn.newName.accept(this)}`;
  }

  override visitInsert(insert: SqlInsert): string {
    return `insert into ${insert.table.accept(this)} (${insert.columns
      .map(c => c.accept(this))
      .join(", ")}) values (${insert.values.map(c => c.accept(this)).join(", ")})${
      !insert.returning.isEmpty() ? this.visitReturning(insert) : ""
    }`;
  }

  protected visitReturning(insert: SqlInsert) {
    return ` returning ${insert.returning.map(r => r.accept(this)).join(", ")}`;
  }

  override visitUpdate(update: SqlUpdate): string {
    return `update ${update.table.accept(this)} set ${update.assignments
      .map(a => a.accept(this))
      .join(", ")}${update.where ? ` where ${update.where.accept(this)}` : ""}`;
  }

  override visitDelete(_delete: SqlDelete): string {
    return `delete from ${_delete.table.accept(this)}${
      _delete.where ? ` where ${_delete.where.accept(this)}` : ""
    }`;
  }

  override visitAddForeignKey(addConstraint: SqlAddForeignKey): string {
    return `alter table ${addConstraint.table.accept(this)} add ${addConstraint.foreignKey.accept(
      this
    )}`;
  }

  override visitForeignKey(foreignKey: SqlForeignKey): string {
    return `foreign key (${foreignKey.columns
      .map(c => c.accept(this))
      .join(", ")}) references ${foreignKey.references.accept(this)} (${foreignKey.referencedColumns
      .map(c => c.accept(this))
      .join(", ")})${this.visitOnDelete(foreignKey.onDelete)}`;
  }

  protected visitOnDelete(onDelete?: OnDelete) {
    return onDelete ? ` on delete ${onDelete}` : "";
  }

  override visitColumn(column: SqlColumn): string {
    return `${column.name.accept(this)} ${this.visitType(column.type)}${
      column.nullable ? "" : " not null"
    }`;
  }

  protected visitType(type: SqlType) {
    return type as string;
  }

  override visitSelect(select: SqlSelect): string {
    let sql = `select${select.distinct ? " distinct " : " "}${this.parens(select.projection)}`;

    if (select.from) {
      sql += `${this.#clauseSep}from ${this.parens(select.from)}`;
    }

    if (select.joins) {
      sql += ` ${select.joins.map(n => n.accept(this)).join(" ")}`;
    }

    if (select.where) {
      sql += `${this.#clauseSep}where ${this.parens(select.where)}`;
    }

    if (select.orderBy) {
      sql += `\norder by ${select.orderBy.accept(this)}`;
    }

    if (select.groupBy) {
      sql += `\ngroup by ${select.groupBy.accept(this)}`;
    }

    if (select.limit) {
      sql += this.visitLimit(select.limit);
    }

    if (select.offset) {
      sql += this.visitOffset(select.offset);
    }

    return sql;
  }

  protected visitOffset(offset: SqlNode) {
    return `\noffset ${offset.accept(this)}`;
  }

  protected visitLimit(limit: SqlNode) {
    return `\nlimit ${limit.accept(this)}`;
  }

  override visitJoin(join: SqlJoin): string {
    return `\n${join.joinType} join ${join.target.accept(this)} on ${join.on.accept(this)}`;
  }

  override visitExists(exists: SqlExists): string {
    return `exists ${this.parens(exists.select)}`;
  }

  override visitIn(inNode: SqlIn): string {
    return `${inNode.operand.accept(this)} in (${inNode.values.accept(this)})`;
  }

  override visitOrderBy(orderBy: SqlOrderBy): string {
    let sql = orderBy.expressions.map(n => n.accept(this)).join(", ");

    if (orderBy.offset) {
      sql += ` offset ${orderBy.offset.accept(this)} rows`;
    }

    if (orderBy.fetchNext) {
      sql += ` fetch next ${orderBy.fetchNext.accept(this)} rows only`;
    }

    return sql;
  }

  override visitOrdering(ordering: SqlOrdering): string {
    return `${this.parens(ordering.node)}${ordering.desc ? " desc" : ""}`;
  }

  override visitAlias(alias: SqlAlias): string {
    return `${this.parens(alias.target)} as ${alias.alias.accept(this)}`;
  }

  override visitTypeAlias(typeAlias: SqlTypeAlias): string {
    return `${this.parens(typeAlias.target)} as ${typeAlias.type}`;
  }

  override visitBinary(binary: SqlBinary): string {
    let left = this.parens(binary.left);
    let right = this.parens(binary.right);

    if (binary.left instanceof SqlBinary) {
      left = `(${left})`;
    }

    if (binary.right instanceof SqlBinary) {
      right = `(${right})`;
    }

    return `${left} ${binary.op} ${right}`;
  }

  override visitFunction(func: SqlFunction): string {
    return `${func.name}(${this.visitFunctionArgs(func.args)})`;
  }

  protected visitFunctionArgs(args: List<SqlNode>) {
    return args.map(n => this.parens(n)).join(", ");
  }

  override visitIdentifier(identifier: SqlIdentifier) {
    return `"${this.escapeIdent(identifier.name)}"`;
  }

  override visitLike(like: SqlLike): string {
    return `${like.operand.accept(this)} like ${like.pattern.accept(this)}`;
  }

  override visitNotLike(notLike: SqlNotLike): string {
    return `${notLike.operand.accept(this)} not like ${notLike.pattern.accept(this)}`;
  }

  override visitNot(not: SqlNot): string {
    return `not (${not.operand.accept(this)})`;
  }

  override visitNegation(negation: SqlNegation): string {
    let operand = negation.operand.accept(this);

    if (negation.operand instanceof SqlBinary) {
      operand = `(${operand})`;
    }

    return `-${operand}`;
  }

  override visitMember(member: SqlMember): string {
    return `${member.object.accept(this)}.${member.member.accept(this)}`;
  }

  override visitNumber(n: SqlNumber) {
    return `${n.value}`;
  }

  override visitBoolean(boolean: SqlBoolean) {
    return boolean.value ? "true" : "false";
  }

  override visitParameter(parameter: SqlParameter) {
    return `$${parameter.id}`;
  }

  override visitStar(_: SqlStar) {
    return "*";
  }

  override visitNull(_: SqlNull) {
    return "null";
  }

  override visitIsNull(isNull: SqlIsNull): string {
    return `${this.parens(isNull.operand)} is null`;
  }

  override visitIsNotNull(isNotNull: SqlIsNotNull): string {
    return `${this.parens(isNotNull.operand)} is not null`;
  }

  override visitString(str: SqlString) {
    return `'${this.escapeString(str.value)}'`;
  }

  override visitTimestamp(timestamp: SqlTimestamp) {
    return `'${timestamp.value.toISOString()}'`;
  }

  override visitComposite(composite: SqlComposite): string {
    return composite.nodes.map(n => n.accept(this)).join(", ");
  }

  override visitRaw(raw: SqlRaw) {
    let sql = "";
    let i = 0;

    for (; i < raw.fragments.size - 1; i++) {
      sql += raw.fragments.get(i);
      sql += raw.params.get(i)!.accept(this);
    }

    sql += raw.fragments.get(i);

    return sql;
  }

  override visitCase(cas: SqlCase): string {
    return `case when ${cas.when.accept(this)} then ${cas.then.accept(this)} else ${cas.elseThen.accept(this)} end`;
  }

  protected escapeIdent(identifier: string) {
    return identifier.replace(/"/g, '""');
  }

  protected escapeString(str: string) {
    return str.replace(/(['\\])/g, "$1$1");
  }

  protected parens(node: SqlNode) {
    const nested = node instanceof SqlSelect || node instanceof SqlRaw;
    let sql = "";

    if (nested) {
      sql += "(\n";
      this.#indent += 3;
    }

    let s = node.accept(this);

    if (nested) {
      s = indent(s, this.#indent);
    }

    sql += s;

    if (nested) {
      this.#indent -= 3;
      sql += "\n)";
    }

    return sql;
  }
}
