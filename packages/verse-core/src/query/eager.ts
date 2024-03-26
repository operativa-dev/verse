import { List } from "immutable";
import { SqlRewriter } from "../db/rewriter.js";
import {
  SqlAlias,
  sqlBin,
  SqlBinary,
  SqlBinding,
  SqlComposite,
  SqlIdentifier,
  SqlJoin,
  SqlJoinType,
  SqlNode,
  SqlOrderBy,
  SqlOrdering,
  SqlSelect,
} from "../db/sql.js";
import { EntityModel, NavigationPropertyModel } from "../model/model.js";
import { CompilationContext, ExpressionCompiler } from "./compiler.js";
import { parse } from "./parser.js";
import { Shaper, ShaperCompiler } from "./shaping.js";

export class LoadNode {
  static create() {
    return new LoadNode();
  }

  readonly #groupKey: string;

  #projection!: SqlComposite;
  #offset!: number;
  #shaper!: Shaper;

  private constructor(
    readonly navigation?: NavigationPropertyModel,
    readonly edges = List<LoadNode>()
  ) {
    this.#groupKey = navigation?.foreignKey!.properties.first()!.name!;
  }

  get name(): string {
    return this.navigation?.name!;
  }

  get many() {
    return this.navigation?.many!;
  }

  get shaper(): Shaper {
    return this.#shaper;
  }

  get groupKey() {
    return this.#groupKey;
  }

  allOnes(): boolean {
    return (!this.navigation || !this.many) && this.edges.every(e => e.allOnes());
  }

  addPath(path: List<NavigationPropertyModel>): LoadNode {
    const navigation = path.first();

    if (!navigation) {
      return this;
    }

    const edgeIndex = this.edges.findIndex(e => e.navigation == navigation);

    const edge = (edgeIndex == -1 ? new LoadNode(navigation) : this.edges.get(edgeIndex)!).addPath(
      path.shift()!
    );

    const edges = edgeIndex == -1 ? this.edges.push(edge) : this.edges.set(edgeIndex, edge);

    return new LoadNode(this.navigation, edges);
  }

  bindProjection(projection: SqlComposite, offset: number) {
    this.#projection = projection;
    this.#offset = offset;

    return this;
  }

  bindShaper(compiler: ShaperCompiler) {
    if (this.#projection) {
      this.#shaper = this.#projection.accept(compiler, this.#offset).fn;
    }

    this.edges.forEach(e => e.bindShaper(compiler));
  }
}

export class EagerLoader extends SqlRewriter {
  #select?: SqlSelect;
  #joins: SqlJoin[] = [];
  #projections: SqlComposite[] = [];
  #alias?: SqlIdentifier;
  #orderBy: SqlNode[] = [];
  #offset = 0;

  constructor(private readonly context: CompilationContext) {
    super();
  }

  override visitComposite(composite: SqlComposite) {
    if (composite.binding?.load && this.#select) {
      this.#offset = this.#select.projection.size;

      return this.#buildJoin(
        composite.binding.load,
        composite.binding.model as EntityModel,
        composite,
        (this.#alias = this.context.createAlias())
      );
    }

    return super.visitComposite(composite);
  }

  #buildJoin(graph: LoadNode, model: EntityModel, parent: SqlComposite, alias: SqlIdentifier) {
    for (const edge of graph.edges) {
      const navigation = edge.navigation!;
      const fk = navigation.foreignKey;

      if (!fk) {
        throw new Error(
          `Navigation '${model.name}'.${navigation.name}' does not have a foreign key configured.`
        );
      }

      model = this.context.metadata.model.entity(navigation.targetName);

      const compiler = new ExpressionCompiler(this.context);

      const related = compiler.selectEntity(model);
      const rhsAlias = this.context.createAlias();
      const rhsProjection = related.projection.scope(rhsAlias) as SqlComposite;

      const offset = this.#offset;

      this.#projections.push(rhsProjection);
      this.#offset += rhsProjection.size;

      const projection = edge.edges.isEmpty()
        ? rhsProjection
        : this.#buildJoin(edge, model, rhsProjection, rhsAlias);

      edge.bindProjection(projection, offset);

      const pkProperties = fk.references.key!.properties;
      const fkProperties = fk.properties;
      const lhsProperties = navigation.many ? pkProperties : fkProperties;
      const onLhs = lhsProperties.map(p => parent.resolve(p.name)!);
      const rhsProperties = navigation.many ? fkProperties : pkProperties;
      const onRhs = rhsProperties.map(p => projection.resolve(p.name));
      const condition = onLhs
        .map((e, i) => sqlBin(e!.scope(alias), "=", onRhs.get(i)!))
        .reduce((acc: SqlBinary, next) => (acc ? sqlBin(acc, "and", next) : next));

      let joinType: SqlJoinType = "inner";

      if (navigation.many) {
        if (navigation.orderBy) {
          const orderBy = compiler.compileFragment(
            parse(navigation.orderBy.toString()),
            rhsProjection
          );

          this.#orderBy.push(orderBy);
        }

        this.#orderBy.push(condition.left);
        joinType = "left";
      }

      this.#joins.push(new SqlJoin(joinType, new SqlAlias(related, rhsAlias), condition));
    }

    return parent;
  }

  override visitSelect(select: SqlSelect) {
    if (!this.#select && select.projection instanceof SqlComposite) {
      this.#select = select;

      const newProjection = select.projection.accept(this) as SqlComposite;

      if (this.#joins.length > 0 && this.#alias) {
        const orderings = this.#orderBy.map(o => new SqlOrdering(o)).reverse();

        let orderBy =
          select.orderBy?.expressions.map(n => n.scope(this.#alias!) as SqlOrdering) ?? List();

        orderBy = orderBy.concat(orderings);

        return new SqlSelect({
          projection: new SqlComposite(
            List.of(newProjection.scope(this.#alias), ...this.#projections),
            new SqlBinding({ eager: true })
          ),
          from: new SqlAlias(select, this.#alias),
          joins: List(this.#joins.reverse()),
          orderBy: orderBy.isEmpty() ? undefined : new SqlOrderBy(orderBy.toOrderedSet().toList()),
        });
      }
    }

    return select;
  }
}
