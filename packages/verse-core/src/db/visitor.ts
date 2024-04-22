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
  SqlDropTable,
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
  SqlNextValue,
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
  SqlTypeAlias,
  SqlUpdate,
} from "./sql.js";

/**
 * Implements the visitor pattern for SQL trees.
 *
 * @template T - The return type of visit methods.
 * @template S - The type of additional state that can be passed to visit methods.
 */
export abstract class SqlVisitor<T, S = unknown> {
  // @ts-ignore
  public visitNode(node: SqlNode, state?: S): T {
    return undefined as T;
  }

  public visitAddForeignKey(addConstraint: SqlAddForeignKey, state?: S): T {
    return this.visitNode(addConstraint, state);
  }

  public visitAlias(alias: SqlAlias, state?: S): T {
    return this.visitNode(alias, state);
  }

  public visitTypeAlias(typeAlias: SqlTypeAlias, state?: S): T {
    return this.visitNode(typeAlias, state);
  }

  public visitBinary(binary: SqlBinary, state?: S): T {
    return this.visitNode(binary, state);
  }

  public visitExists(exists: SqlExists, state?: S): T {
    return this.visitNode(exists, state);
  }

  public visitIn(_in: SqlIn, state?: S): T {
    return this.visitNode(_in, state);
  }

  public visitLike(like: SqlLike, state?: S): T {
    return this.visitNode(like, state);
  }

  public visitNotLike(notLike: SqlNotLike, state?: S): T {
    return this.visitNode(notLike, state);
  }

  public visitNegation(negation: SqlNegation, state?: S): T {
    return this.visitNode(negation, state);
  }

  public visitNot(not: SqlNot, state?: S): T {
    return this.visitNode(not, state);
  }

  public visitComposite(composite: SqlComposite, state?: S): T {
    return this.visitNode(composite, state);
  }

  public visitCreateDatabase(createDatabase: SqlCreateDatabase, state?: S): T {
    return this.visitNode(createDatabase, state);
  }

  public visitDropDatabase(dropDatabase: SqlDropDatabase, state?: S): T {
    return this.visitNode(dropDatabase, state);
  }

  public visitCreateTable(createTable: SqlCreateTable, state?: S): T {
    return this.visitNode(createTable, state);
  }

  public visitDropTable(dropTable: SqlDropTable, state?: S): T {
    return this.visitNode(dropTable, state);
  }

  public visitRenameTable(renameTable: SqlRenameTable, state?: S): T {
    return this.visitNode(renameTable, state);
  }

  public visitCreateIndex(createIndex: SqlCreateIndex, state?: S): T {
    return this.visitNode(createIndex, state);
  }

  public visitDropIndex(dropIndex: SqlDropIndex, state?: S): T {
    return this.visitNode(dropIndex, state);
  }

  public visitCreateSequence(createSequence: SqlCreateSequence, state?: S): T {
    return this.visitNode(createSequence, state);
  }

  public visitDropSequence(dropSequence: SqlDropSequence, state?: S): T {
    return this.visitNode(dropSequence, state);
  }

  public visitAddColumn(addColumn: SqlAddColumn, state?: S): T {
    return this.visitNode(addColumn, state);
  }

  public visitDropColumn(dropColumn: SqlDropColumn, state?: S): T {
    return this.visitNode(dropColumn, state);
  }

  public visitRenameColumn(renameColumn: SqlRenameColumn, state?: S): T {
    return this.visitNode(renameColumn, state);
  }

  public visitColumn(column: SqlColumn, state?: S): T {
    return this.visitNode(column, state);
  }

  public visitIdentifier(identifier: SqlIdentifier, state?: S): T {
    return this.visitNode(identifier, state);
  }

  public visitNextValue(nextValue: SqlNextValue, state?: S): T {
    return this.visitNode(nextValue, state);
  }

  public visitForeignKey(foreignKey: SqlForeignKey, state?: S): T {
    return this.visitNode(foreignKey, state);
  }

  public visitFunction(func: SqlFunction, state?: S): T {
    return this.visitNode(func, state);
  }

  public visitInsert(insert: SqlInsert, state?: S): T {
    return this.visitNode(insert, state);
  }

  public visitUpdate(update: SqlUpdate, state?: S): T {
    return this.visitNode(update, state);
  }

  public visitDelete(_delete: SqlDelete, state?: S): T {
    return this.visitNode(_delete, state);
  }

  public visitJoin(join: SqlJoin, state?: S): T {
    return this.visitNode(join, state);
  }

  public visitOrderBy(orderBy: SqlOrderBy, state?: S): T {
    return this.visitNode(orderBy, state);
  }

  public visitOrdering(ordering: SqlOrdering, state?: S): T {
    return this.visitNode(ordering, state);
  }

  public visitMember(member: SqlMember, state?: S): T {
    return this.visitNode(member, state);
  }

  public visitNumber(n: SqlNumber, state?: S): T {
    return this.visitNode(n, state);
  }

  public visitBoolean(boolean: SqlBoolean, state?: S): T {
    return this.visitNode(boolean, state);
  }

  public visitParameter(parameter: SqlParameter, state?: S): T {
    return this.visitNode(parameter, state);
  }

  public visitSelect(select: SqlSelect, state?: S): T {
    return this.visitNode(select, state);
  }

  public visitStar(star: SqlStar, state?: S): T {
    return this.visitNode(star, state);
  }

  public visitNull(nul: SqlNull, state?: S): T {
    return this.visitNode(nul, state);
  }

  public visitIsNull(isNull: SqlIsNull, state?: S): T {
    return this.visitNode(isNull, state);
  }

  public visitIsNotNull(isNotNull: SqlIsNotNull, state?: S): T {
    return this.visitNode(isNotNull, state);
  }

  public visitString(str: SqlString, state?: S): T {
    return this.visitNode(str, state);
  }

  public visitTimestamp(timestamp: SqlTimestamp, state?: S): T {
    return this.visitNode(timestamp, state);
  }

  public visitRaw(raw: SqlRaw, state?: S): T {
    return this.visitNode(raw, state);
  }

  public visitCase(cas: SqlCase, state?: S): T {
    return this.visitNode(cas, state);
  }

  public visitSet(set: SqlSet, state?: S): T {
    return this.visitNode(set, state);
  }
}
