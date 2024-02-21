import { List } from "immutable";
import {
  SqlAddColumn,
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
  SqlFunction,
  SqlIdentifier,
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
  SqlTypeAlias,
  SqlUpdate,
} from "./sql.js";
import { SqlVisitor } from "./visitor.js";

/**
 * A {@link SqlVisitor} for persistently rewriting SQL trees.
 * This class provides methods for visiting different types of SQL nodes and rewriting them.
 */
export abstract class SqlRewriter extends SqlVisitor<SqlNode> {
  override visitNode(node: SqlNode): SqlNode {
    throw new Error(`'visit${node.constructor.name.slice(3)}' is not implemented!`);
  }

  override visitSet(set: SqlSet) {
    return set.rewrite(this);
  }

  override visitAlias(alias: SqlAlias) {
    return alias.rewrite(this);
  }

  override visitTypeAlias(typeAlias: SqlTypeAlias) {
    return typeAlias.rewrite(this);
  }

  override visitBinary(binary: SqlBinary) {
    return binary.rewrite(this);
  }

  override visitExists(exists: SqlExists) {
    return exists.rewrite(this);
  }

  override visitLike(like: SqlLike) {
    return like.rewrite(this);
  }

  override visitNotLike(notLike: SqlNotLike) {
    return notLike.rewrite(this);
  }

  override visitNegation(negation: SqlNegation) {
    return negation.rewrite(this);
  }

  override visitNot(not: SqlNot) {
    return not.rewrite(this);
  }

  override visitComposite(composite: SqlComposite) {
    return composite.rewrite(this);
  }

  override visitCreateDatabase(createDatabase: SqlCreateDatabase) {
    return createDatabase.rewrite(this);
  }

  override visitDropDatabase(dropDatabase: SqlDropDatabase) {
    return dropDatabase.rewrite(this);
  }

  override visitCreateTable(createTable: SqlCreateTable) {
    return createTable.rewrite(this);
  }

  override visitDropTable(dropTable: SqlDropTable) {
    return dropTable.rewrite(this);
  }

  override visitRenameTable(renameTable: SqlRenameTable) {
    return renameTable.rewrite(this);
  }

  override visitCreateSequence(createSequence: SqlCreateSequence) {
    return createSequence.rewrite(this);
  }

  override visitDropSequence(dropSequence: SqlDropSequence) {
    return dropSequence.rewrite(this);
  }

  override visitCreateIndex(createIndex: SqlCreateIndex) {
    return createIndex.rewrite(this);
  }

  override visitDropIndex(dropIndex: SqlDropIndex) {
    return dropIndex.rewrite(this);
  }

  override visitAddColumn(addColumn: SqlAddColumn) {
    return addColumn.rewrite(this);
  }

  override visitDropColumn(dropColumn: SqlDropColumn) {
    return dropColumn.rewrite(this);
  }

  override visitRenameColumn(renameColumn: SqlRenameColumn) {
    return renameColumn.rewrite(this);
  }

  override visitColumn(column: SqlColumn) {
    return column.rewrite(this);
  }

  override visitIdentifier(identifier: SqlIdentifier) {
    return identifier.rewrite(this);
  }

  override visitFunction(func: SqlFunction) {
    return func.rewrite(this);
  }

  override visitInsert(insert: SqlInsert) {
    return insert.rewrite(this);
  }

  override visitUpdate(update: SqlUpdate) {
    return update.rewrite(this);
  }

  override visitDelete(_delete: SqlDelete) {
    return _delete.rewrite(this);
  }

  override visitJoin(join: SqlJoin) {
    return join.rewrite(this);
  }

  override visitOrderBy(orderBy: SqlOrderBy) {
    return orderBy.rewrite(this);
  }

  override visitOrdering(ordering: SqlOrdering) {
    return ordering.rewrite(this);
  }

  override visitMember(member: SqlMember) {
    return member.rewrite(this);
  }

  override visitNumber(n: SqlNumber) {
    return n.rewrite(this);
  }

  override visitBoolean(boolean: SqlBoolean) {
    return boolean.rewrite(this);
  }

  override visitParameter(parameter: SqlParameter) {
    return parameter.rewrite(this);
  }

  override visitSelect(select: SqlSelect) {
    return select.rewrite(this);
  }

  override visitStar(star: SqlStar) {
    return star.rewrite(this);
  }

  override visitNull(nul: SqlNull) {
    return nul.rewrite(this);
  }

  override visitIsNull(isNull: SqlIsNull) {
    return isNull.rewrite(this);
  }

  override visitIsNotNull(isNotNull: SqlIsNotNull) {
    return isNotNull.rewrite(this);
  }

  override visitString(str: SqlString) {
    return str.rewrite(this);
  }

  override visitTimestamp(timestamp: SqlTimestamp) {
    return timestamp.rewrite(this);
  }

  override visitRaw(raw: SqlRaw) {
    return raw.rewrite(this);
  }

  override visitCase(cas: SqlCase) {
    return cas.rewrite(this);
  }

  public rewriteProjection(projection: SqlNode) {
    return projection.accept(this);
  }

  rewriteList<T extends SqlNode>(list?: List<T>) {
    return list?.withMutations(mutable => {
      for (let i = 0; i < mutable.size; i++) {
        const item = mutable.get(i)!;
        const newItem = item.accept<SqlNode>(this);
        if (newItem !== item) {
          mutable.set(i, newItem as T);
        }
      }
    });
  }
}
