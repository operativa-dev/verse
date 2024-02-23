import { is } from "immutable";
import { SqlRewriter } from "./rewriter.js";
import {
  SqlAlias,
  SqlComposite,
  SqlIdentifier,
  SqlJoin,
  SqlMember,
  SqlNode,
  SqlSelect,
} from "./sql.js";

export class SqlOptimizer {
  optimize(sql: SqlNode) {
    let prevSql: SqlNode;
    let counter = 0;

    while (counter < 5) {
      prevSql = sql;

      sql = sql
        .accept(new IdentitySelectRemover())
        .accept(new JoinLifter())
        .accept(new ProjectionEliminator());

      if (prevSql === sql) {
        break;
      }

      counter++;
    }

    if (counter === 5) {
      throw new Error(
        "Maximum iteration limit exceeded when optimizing SQL tree! Redundant new instance?"
      );
    }

    return sql;
  }
}

class ProjectionEliminator extends SqlRewriter {
  override visitSelect(select: SqlSelect): SqlNode {
    let newSelect = super.visitSelect(select) as SqlSelect;

    if (
      newSelect.from instanceof SqlAlias &&
      newSelect.from.target instanceof SqlSelect &&
      newSelect.from.target.projection instanceof SqlComposite &&
      this.#canEliminate(newSelect)
    ) {
      return newSelect.from.target.withProjection(
        new ProjectionRemapper(
          newSelect.from.target.projection,
          newSelect.from.alias
        ).rewriteProjection(newSelect.projection)
      );
    }

    return newSelect;
  }

  #canEliminate(select: SqlSelect) {
    return (
      !select.joins &&
      !select.where &&
      !select.orderBy &&
      !select.groupBy &&
      !select.limit &&
      !select.offset
    );
  }
}

class JoinLifter extends SqlRewriter {
  override visitSelect(select: SqlSelect) {
    let newSelect = super.visitSelect(select) as SqlSelect;

    if (newSelect.from instanceof SqlAlias) {
      const alias = newSelect.from;

      if (alias.target instanceof SqlSelect) {
        const innerSelect = alias.target;

        if (innerSelect.from instanceof SqlAlias) {
          const innerAlias = innerSelect.from as SqlAlias;

          if (
            !newSelect.joins &&
            innerAlias.target instanceof SqlIdentifier &&
            innerSelect.projection instanceof SqlComposite &&
            innerSelect.joins &&
            this.#isLiftable(innerSelect)
          ) {
            return newSelect
              .withFrom(innerAlias)
              .withJoins(innerSelect.joins)
              .accept(new ProjectionRemapper(innerSelect.projection, alias.alias));
          }
        }
      }
    }

    return newSelect;
  }

  #isLiftable(innerSelect: SqlSelect) {
    return (
      innerSelect.distinct === undefined &&
      !innerSelect.where &&
      !innerSelect.orderBy &&
      !innerSelect.groupBy &&
      !innerSelect.limit &&
      !innerSelect.offset
    );
  }
}

class ProjectionRemapper extends SqlRewriter {
  #aliasesValid = false;

  constructor(
    private projection: SqlComposite,
    private remappedAlias: SqlIdentifier
  ) {
    super();
  }

  override visitMember(member: SqlMember) {
    if (member.object instanceof SqlIdentifier && is(member.object, this.remappedAlias)) {
      const node = this.projection
        .reduce()
        .find(
          n =>
            (n instanceof SqlMember && is(member.member, n.member)) ||
            (n instanceof SqlAlias && is(member.member, n.alias))
        )!;

      return node instanceof SqlAlias && !this.#aliasesValid
        ? node.target.bind(member.binding!)
        : node.bind(member.binding!);
    }

    return member;
  }

  protected override beforeVisit(node: SqlNode) {
    this.#aliasesValid =
      this.#aliasesValid && (node instanceof SqlComposite || node instanceof SqlMember);
  }

  override rewriteProjection(projection: SqlNode): SqlNode {
    this.#aliasesValid = true;

    return super.rewriteProjection(projection);
  }
}

class IdentitySelectRemover extends SqlRewriter {
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
