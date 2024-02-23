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

  // @ts-ignore
  protected beforeVisit(node: SqlNode) {}

  override visitSet(set: SqlSet) {
    this.beforeVisit(set);
    return set.rewrite(this);
  }

  override visitAlias(alias: SqlAlias) {
    this.beforeVisit(alias);
    return alias.rewrite(this);
  }

  override visitTypeAlias(typeAlias: SqlTypeAlias) {
    this.beforeVisit(typeAlias);
    return typeAlias.rewrite(this);
  }

  override visitBinary(binary: SqlBinary) {
    this.beforeVisit(binary);
    return binary.rewrite(this);
  }

  override visitExists(exists: SqlExists) {
    this.beforeVisit(exists);
    return exists.rewrite(this);
  }

  override visitLike(like: SqlLike) {
    this.beforeVisit(like);
    return like.rewrite(this);
  }

  override visitNotLike(notLike: SqlNotLike) {
    this.beforeVisit(notLike);
    return notLike.rewrite(this);
  }

  override visitNegation(negation: SqlNegation) {
    this.beforeVisit(negation);
    return negation.rewrite(this);
  }

  override visitNot(not: SqlNot) {
    this.beforeVisit(not);
    return not.rewrite(this);
  }

  override visitComposite(composite: SqlComposite) {
    this.beforeVisit(composite);
    return composite.rewrite(this);
  }

  override visitCreateDatabase(createDatabase: SqlCreateDatabase) {
    this.beforeVisit(createDatabase);
    return createDatabase.rewrite(this);
  }

  override visitDropDatabase(dropDatabase: SqlDropDatabase) {
    this.beforeVisit(dropDatabase);
    return dropDatabase.rewrite(this);
  }

  override visitCreateTable(createTable: SqlCreateTable) {
    this.beforeVisit(createTable);
    return createTable.rewrite(this);
  }

  override visitDropTable(dropTable: SqlDropTable) {
    this.beforeVisit(dropTable);
    return dropTable.rewrite(this);
  }

  override visitRenameTable(renameTable: SqlRenameTable) {
    this.beforeVisit(renameTable);
    return renameTable.rewrite(this);
  }

  override visitCreateSequence(createSequence: SqlCreateSequence) {
    this.beforeVisit(createSequence);
    return createSequence.rewrite(this);
  }

  override visitDropSequence(dropSequence: SqlDropSequence) {
    this.beforeVisit(dropSequence);
    return dropSequence.rewrite(this);
  }

  override visitCreateIndex(createIndex: SqlCreateIndex) {
    this.beforeVisit(createIndex);
    return createIndex.rewrite(this);
  }

  override visitDropIndex(dropIndex: SqlDropIndex) {
    this.beforeVisit(dropIndex);
    return dropIndex.rewrite(this);
  }

  override visitAddColumn(addColumn: SqlAddColumn) {
    this.beforeVisit(addColumn);
    return addColumn.rewrite(this);
  }

  override visitDropColumn(dropColumn: SqlDropColumn) {
    this.beforeVisit(dropColumn);
    return dropColumn.rewrite(this);
  }

  override visitRenameColumn(renameColumn: SqlRenameColumn) {
    this.beforeVisit(renameColumn);
    return renameColumn.rewrite(this);
  }

  override visitColumn(column: SqlColumn) {
    this.beforeVisit(column);
    return column.rewrite(this);
  }

  override visitIdentifier(identifier: SqlIdentifier) {
    this.beforeVisit(identifier);
    return identifier.rewrite(this);
  }

  override visitFunction(func: SqlFunction) {
    this.beforeVisit(func);
    return func.rewrite(this);
  }

  override visitInsert(insert: SqlInsert) {
    this.beforeVisit(insert);
    return insert.rewrite(this);
  }

  override visitUpdate(update: SqlUpdate) {
    this.beforeVisit(update);
    return update.rewrite(this);
  }

  override visitDelete(_delete: SqlDelete) {
    this.beforeVisit(_delete);
    return _delete.rewrite(this);
  }

  override visitJoin(join: SqlJoin) {
    this.beforeVisit(join);
    return join.rewrite(this);
  }

  override visitOrderBy(orderBy: SqlOrderBy) {
    this.beforeVisit(orderBy);
    return orderBy.rewrite(this);
  }

  override visitOrdering(ordering: SqlOrdering) {
    this.beforeVisit(ordering);
    return ordering.rewrite(this);
  }

  override visitMember(member: SqlMember) {
    this.beforeVisit(member);
    return member.rewrite(this);
  }

  override visitNumber(n: SqlNumber) {
    this.beforeVisit(n);
    return n.rewrite(this);
  }

  override visitBoolean(boolean: SqlBoolean) {
    this.beforeVisit(boolean);
    return boolean.rewrite(this);
  }

  override visitParameter(parameter: SqlParameter) {
    this.beforeVisit(parameter);
    return parameter.rewrite(this);
  }

  override visitSelect(select: SqlSelect) {
    this.beforeVisit(select);
    return select.rewrite(this);
  }

  override visitStar(star: SqlStar) {
    this.beforeVisit(star);
    return star.rewrite(this);
  }

  override visitNull(nul: SqlNull) {
    this.beforeVisit(nul);
    return nul.rewrite(this);
  }

  override visitIsNull(isNull: SqlIsNull) {
    this.beforeVisit(isNull);
    return isNull.rewrite(this);
  }

  override visitIsNotNull(isNotNull: SqlIsNotNull) {
    this.beforeVisit(isNotNull);
    return isNotNull.rewrite(this);
  }

  override visitString(str: SqlString) {
    this.beforeVisit(str);
    return str.rewrite(this);
  }

  override visitTimestamp(timestamp: SqlTimestamp) {
    this.beforeVisit(timestamp);
    return timestamp.rewrite(this);
  }

  override visitRaw(raw: SqlRaw) {
    this.beforeVisit(raw);
    return raw.rewrite(this);
  }

  override visitCase(cas: SqlCase) {
    this.beforeVisit(cas);
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
