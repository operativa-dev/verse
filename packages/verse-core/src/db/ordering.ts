import { OrderedSet } from "immutable";
import { SqlRewriter } from "./rewriter.js";
import { SqlAlias, SqlNode, SqlOrderBy, SqlOrdering, SqlSelect } from "./sql.js";

export class OrderByLifter extends SqlRewriter {
  #orderings: OrderedSet<SqlOrdering> = OrderedSet();

  override visitSelect(select: SqlSelect): SqlNode {
    select.orderBy?.accept(this);
    select.from?.accept(this);

    const alias = (select.from as SqlAlias)?.alias;

    if (!this.#orderings.isEmpty()) {
      return select.withOrderBy(
        new SqlOrderBy(this.#orderings.map(o => o.scope(alias) as SqlOrdering).toList())
      );
    }

    return select;
  }

  override visitOrdering(ordering: SqlOrdering): SqlNode {
    this.#orderings = this.#orderings.add(ordering);

    return ordering;
  }
}
