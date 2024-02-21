import { SqlRewriter } from "./rewriter.js";
import { SqlAlias, SqlIdentifier, SqlJoin, SqlMember, SqlNode, SqlSelect } from "./sql.js";

export class SqlOptimizer extends SqlRewriter {
  override visitSelect(select: SqlSelect) {
    let newSelect = super.visitSelect(select) as SqlSelect;

    newSelect = this.#removeIdentitySelect(
      newSelect,
      (select, alias) => select.withFrom(alias),
      newSelect.from
    );

    return newSelect;
  }

  override visitJoin(join: SqlJoin) {
    let newJoin = super.visitJoin(join) as SqlJoin;

    newJoin = this.#removeIdentitySelect(
      newJoin,
      (join, alias) => join.withTarget(alias),
      newJoin.target
    );

    return newJoin;
  }

  #removeIdentitySelect<T extends SqlNode>(
    parent: T,
    update: (parent: T, alias: SqlAlias) => T,
    target?: SqlNode
  ) {
    if (target instanceof SqlAlias) {
      const alias = target;

      if (alias.target instanceof SqlSelect) {
        const innerSelect = alias.target;

        if (innerSelect.from instanceof SqlAlias) {
          const innerAlias = innerSelect.from as SqlAlias;

          if (this.#isIdentitySelect(innerAlias, innerSelect)) {
            return update(parent, new SqlAlias(innerAlias.target, alias.alias));
          }
        }
      }
    }

    return parent;
  }

  #isIdentitySelect(innerAlias: SqlAlias, innerSelect: SqlSelect) {
    return (
      innerAlias.target instanceof SqlIdentifier &&
      innerSelect.projection.reduce().every(n => n instanceof SqlMember) &&
      innerSelect.distinct === undefined &&
      !innerSelect.joins &&
      !innerSelect.where &&
      !innerSelect.orderBy &&
      !innerSelect.groupBy &&
      !innerSelect.limit &&
      !innerSelect.offset
    );
  }
}
