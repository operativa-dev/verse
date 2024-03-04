import { is } from "immutable";
import { SqlRewriter } from "./rewriter.js";
import {
  SqlAlias,
  SqlBinary,
  SqlComposite,
  SqlIdentifier,
  SqlJoin,
  SqlMember,
  SqlNode,
  SqlSelect,
} from "./sql.js";

export class SqlOptimizer {
  optimize(sql: SqlNode) {
    return sql
      .accept(new IdentitySelectRemover())
      .accept(new JoinLifter())
      .accept(new OuterQueryEliminator())
      .accept(new ScalarSubqueryEliminator());
  }
}

class ScalarSubqueryEliminator extends SqlRewriter {
  #stack: [SqlSelect, SqlJoin[]][] = [];

  override visitSelect(select: SqlSelect) {
    this.#stack.push([select, []]);

    let newSelect = super.visitSelect(select) as SqlSelect;

    let [parent, joins] = this.#stack.pop()!;

    newSelect = newSelect.addJoins(...joins);

    if (this.#stack.length > 0) {
      [parent, joins] = this.#stack[this.#stack.length - 1]!;

      if (
        parent &&
        parent.from instanceof SqlAlias &&
        newSelect.from instanceof SqlAlias &&
        newSelect.projection.size === 1 &&
        newSelect.projection.reduce().every(n => n instanceof SqlMember) &&
        !newSelect.distinct &&
        !newSelect.joins &&
        !newSelect.groupBy &&
        !newSelect.orderBy &&
        !newSelect.limit &&
        !newSelect.offset &&
        newSelect.where &&
        new ScalarSubqueryPredicateChecker().check(newSelect.where)
      ) {
        joins.push(new SqlJoin("inner", newSelect.from, newSelect.where));

        return newSelect.projection;
      }
    }

    return newSelect;
  }

  override visitAlias(alias: SqlAlias): SqlNode {
    const newAlias = super.visitAlias(alias) as SqlAlias;

    if (newAlias !== alias && newAlias.target instanceof SqlAlias) {
      return new SqlAlias(newAlias.target.target, newAlias.alias);
    }

    return newAlias;
  }
}

class ScalarSubqueryPredicateChecker extends SqlRewriter {
  #canLift = true;

  constructor() {
    super();
  }

  check(node: SqlNode) {
    node.accept(this);

    return this.#canLift;
  }

  override visitBinary(binary: SqlBinary) {
    this.#canLift = this.#canLift && (binary.op === "=" || binary.op === "and");

    binary.left.accept(this);
    binary.right.accept(this);

    return binary;
  }

  override visitMember(member: SqlMember) {
    return member;
  }

  protected override beforeVisit(_: SqlNode) {
    this.#canLift = false;
  }
}

class OuterQueryEliminator extends SqlRewriter {
  override visitSelect(select: SqlSelect): SqlNode {
    let outerSelect = super.visitSelect(select) as SqlSelect;

    if (
      outerSelect.from instanceof SqlAlias &&
      outerSelect.from.target instanceof SqlSelect &&
      outerSelect.from.target.from instanceof SqlAlias
    ) {
      const innerSelect = outerSelect.from.target;

      const aliases = this.#aliasesToEliminate(
        outerSelect,
        innerSelect,
        outerSelect.from.alias,
        outerSelect.from.target.from.alias
      );

      if (aliases.length > 0) {
        let result = innerSelect.withProjection(
          new ProjectionRemapper(innerSelect.projection, aliases).rewriteProjection(
            outerSelect.projection
          )
        );

        if (outerSelect.limit || outerSelect.offset) {
          result = result.withLimit(outerSelect.limit).withOffset(outerSelect.offset);
        }

        return result;
      }
    }

    return outerSelect;
  }

  #aliasesToEliminate(
    outerSelect: SqlSelect,
    innerSelect: SqlSelect,
    outerAlias: SqlIdentifier,
    innerAlias: SqlIdentifier
  ) {
    const aliases = [];

    if (
      outerSelect.distinct === innerSelect.distinct &&
      !outerSelect.where &&
      !outerSelect.orderBy &&
      !outerSelect.groupBy &&
      ((!outerSelect.limit && !outerSelect.offset) || (!innerSelect.limit && !innerSelect.offset))
    ) {
      aliases.push(outerAlias);
    }

    const duplicateJoins: SqlJoin[] = [];

    if (outerSelect.joins) {
      if (innerSelect.joins) {
        outerSelect.joins.forEach(j1 => {
          const duplicate = innerSelect.joins?.find(
            j2 =>
              j1.joinType === j2.joinType &&
              j1.target instanceof SqlAlias &&
              j2.target instanceof SqlAlias &&
              is(j1.target.target, j2.target.target) &&
              this.#onsEqual(j1.on, j2.on, {
                outer: outerAlias,
                outerJoin: j1.target.alias,
                inner: innerAlias,
                innerJoin: j2.target.alias,
              })
          );

          if (duplicate) {
            duplicateJoins.push(j1);
          }
        });
      }

      if (duplicateJoins.length !== outerSelect.joins.size) {
        aliases.pop();
      } else {
        aliases.push(...duplicateJoins.map(j => (j.target as SqlAlias).alias));
      }
    }

    return aliases;
  }

  #onsEqual(
    node1: SqlNode,
    node2: SqlNode,
    aliases: {
      outer: SqlIdentifier;
      outerJoin: SqlIdentifier;
      inner: SqlIdentifier;
      innerJoin: SqlIdentifier;
    }
  ): boolean {
    if (node1 instanceof SqlBinary && node2 instanceof SqlBinary) {
      if (node1.op === "and" && node2.op === "and") {
        return (
          this.#onsEqual(node1.left, node2.left, aliases) &&
          this.#onsEqual(node1.right, node2.right, aliases)
        );
      }

      if (node1.op === "=" && node2.op === "=") {
        const node1Left = node1.left as SqlMember;
        const node1Right = node1.right as SqlMember;
        const node2Left = node2.left as SqlMember;
        const node2Right = node2.right as SqlMember;

        return (
          node1Left.object instanceof SqlIdentifier &&
          node1Left.object.name === aliases.outer.name &&
          node1Right.object instanceof SqlIdentifier &&
          node1Right.object.name === aliases.outerJoin.name &&
          node1Left.member.name === node1Right.member.name &&
          node2Left.object instanceof SqlIdentifier &&
          node2Left.object.name === aliases.inner.name &&
          node2Right.object instanceof SqlIdentifier &&
          node2Right.object.name === aliases.innerJoin.name &&
          node2Left.member.name === node2Right.member.name
        );
      }
    }

    return false;
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
            innerSelect.joins &&
            this.#isLiftable(innerSelect)
          ) {
            return newSelect
              .withFrom(innerAlias)
              .withJoins(innerSelect.joins)
              .accept(new ProjectionRemapper(innerSelect.projection, [alias.alias]));
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
    private projection: SqlNode,
    private remappedAliases: SqlIdentifier[]
  ) {
    super();
  }

  override visitMember(member: SqlMember) {
    if (
      member.object instanceof SqlIdentifier &&
      this.remappedAliases.some(a => is(member.object, a))
    ) {
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
