import { List, Map, Set as ImmutableSet, Stack } from "immutable";
import invariant from "tiny-invariant";
import { Primitive } from "ts-essentials";
import { SqlOptimizer } from "../db/optimizer.js";
import { OrderByLifter } from "../db/ordering.js";
import { SqlNullSemantics } from "../db/semantics.js";
import {
  primitiveToSql,
  SqlAlias,
  sqlBin,
  SqlBinaryOperator,
  SqlBinding,
  SqlComposite,
  SqlExists,
  SqlFunction,
  sqlId,
  SqlIdentifier,
  SqlIn,
  SqlIsNotNull,
  SqlIsNull,
  SqlJoin,
  SqlLike,
  SqlMember,
  SqlNegation,
  SqlNode,
  SqlNot,
  SqlNull,
  SqlNumber,
  SqlOrderBy,
  SqlOrdering,
  SqlParameter,
  SqlRaw,
  SqlSelect,
  SqlStar,
  sqlStr,
  SqlString,
  SqlTimestamp,
  SqlType,
} from "../db/sql.js";
import { Converter } from "../model/builder.js";
import {
  ConversionModel,
  EntityModel,
  Model,
  NavigationPropertyModel,
  ScalarPropertyModel,
  StructuralModel,
  ValueObjectPropertyModel,
} from "../model/model.js";
import { QueryCache } from "../uow.js";
import { error } from "../utils/utils.js";
import { From, Metadata, QueryOptions } from "../verse.js";
import { EagerLoader, LoadNode } from "./eager.js";
import { constant, ConstantExpression, EntityExpression, ExpressionVisitor } from "./expression.js";
import {
  ArrayExpression,
  ArrowFunctionExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  IdentifierExpression,
  LiteralExpression,
  MemberExpression,
  NewExpression,
  ObjectExpression,
  parse,
  PropertyExpression,
  SpreadExpression,
  TaggedTemplateExpression,
  TemplateExpression,
  TemplateLiteralExpression,
  UnaryExpression,
} from "./parser.js";
import { printExpr } from "./printer.js";
import { __expr, AsyncSequence } from "./queryable.js";
import { Shaper, ShaperCompiler, ShaperContext } from "./shaping.js";
import isNumeric = SqlType.isNumeric;
import isText = SqlType.isText;

export class QueryCompiler {
  constructor(
    private readonly metadata: Metadata,
    private readonly from: From
  ) {}

  compile<A extends readonly unknown[]>(
    query: (from: From, ...args: A) => unknown,
    localParams = true
  ) {
    const queryJS = query.toString();
    const arrowExpr = parse(queryJS) as ArrowFunctionExpression;

    let expr = arrowExpr.body;

    if (expr.type === "ThisExpression") {
      expr = (query as any)(this.from)[__expr]();
    }

    this.metadata.config.logger?.debug(expr);

    const argsMap = List(arrowExpr.params?.map(e => (e as IdentifierExpression).name));

    const compiler = new ExpressionCompiler(
      new CompilationContext(this.metadata),
      argsMap,
      localParams
    );

    const { sql, cardinality, locals, conversions } = compiler.compile(expr);

    const shaper = new ShaperCompiler().compile(sql);

    this.metadata.config.logger?.debug(shaper.toString() + "\n");

    const rows = this.#rows(sql, argsMap.size - 1, locals, conversions, this.metadata.model);

    if (cardinality !== "many") {
      return async (args: readonly A[], cache?: QueryCache) =>
        this.#one(args, rows, shaper, cardinality, cache);
    }

    return (args: readonly A[], cache?: QueryCache) =>
      new AsyncSequenceImpl(this.#many(args, rows, shaper, cache));
  }

  #rows(
    sql: SqlNode,
    arity: number,
    locals: List<Primitive>,
    conversions: Map<number, Converter>,
    model: Model
  ) {
    const rows = this.metadata.config.driver.rows(sql);

    return (args: readonly unknown[]) => {
      const allArgs: any[] = [];

      args.forEach(arg => allArgs.push(arg ?? null));

      for (let i = 0; i < arity - args.length; i++) {
        allArgs.push(null);
      }

      locals.forEach(arg => allArgs.push(arg ?? null));

      allArgs.forEach((_, i) => {
        const converter = conversions.get(i) ?? model.conversion(allArgs[i]?.constructor)?.write;

        if (converter) {
          allArgs[i] = converter(allArgs[i]);
        }
      });

      return rows(allArgs);
    };
  }

  async #one(
    args: readonly unknown[],
    rows: (args: readonly unknown[]) => AsyncIterable<readonly unknown[]>,
    shaper: Shaper,
    cardinality: Cardinality,
    cache?: QueryCache
  ) {
    const start = performance.now();

    let result: undefined;

    const iterator = new RowIterator(rows(args)[Symbol.asyncIterator]());
    const context = new ShaperContext(iterator, cache);

    while (true) {
      const { value, done } = await iterator.next();

      if (done) {
        break;
      }

      if (result !== undefined) {
        throw new Error("Query produced more than one result (expected 1).");
      }

      result = await shaper(value, context);
    }

    this.metadata.config.logger?.info(
      `Query executed in: ${(performance.now() - start).toFixed(2)}ms`
    );

    if (result !== undefined || cardinality === "optional") {
      return result;
    }

    throw new Error("Query produced no results (expected 1).");
  }

  async *#many(
    args: readonly unknown[],
    rows: (args: readonly unknown[]) => AsyncIterable<readonly unknown[]>,
    shaper: Shaper,
    cache?: QueryCache
  ) {
    const start = performance.now();

    const iterator = new RowIterator(rows(args)[Symbol.asyncIterator]());
    const context = new ShaperContext(iterator, cache);

    while (true) {
      const { value, done } = await iterator.next();

      if (done) {
        break;
      }

      yield await shaper(value, context);
    }

    this.metadata.config.logger?.info(
      `Query executed in: ${(performance.now() - start).toFixed(2)}ms`
    );
  }
}

export class RowIterator implements AsyncIterator<readonly unknown[]> {
  private iterator: AsyncIterator<readonly unknown[]>;
  private nextValue?: Promise<IteratorResult<readonly unknown[]>> | undefined;

  constructor(iterator: AsyncIterator<readonly unknown[]>) {
    this.iterator = iterator;
  }

  async peek() {
    if (!this.nextValue) {
      this.nextValue = this.iterator.next();
    }

    return this.nextValue;
  }

  async next() {
    if (this.nextValue) {
      const result = this.nextValue;
      this.nextValue = undefined;
      return result;
    }

    return this.iterator.next();
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

class AsyncSequenceImpl<T> implements AsyncSequence<T> {
  constructor(readonly iterable: AsyncIterable<T>) {}

  [Symbol.asyncIterator]() {
    return this.iterable[Symbol.asyncIterator]();
  }

  async toArray() {
    const list: T[] = [];
    for await (const i of this) {
      list.push(i);
    }
    return list;
  }
}

type Cardinality = "many" | "one" | "optional";

export class CompilationContext {
  #aliasCount = 0;
  #columnCount = 0;

  constructor(readonly metadata: Metadata) {}

  createAlias() {
    return sqlId(`t${this.#aliasCount++}`);
  }

  uniquify(node: SqlNode) {
    return node.uniquify(new Set<string>(), n => this.identify(n));
  }

  identify(node: SqlNode) {
    return new SqlAlias(node, sqlId(`c${this.#columnCount++}`), node.binding);
  }
}

export class ExpressionCompiler extends ExpressionVisitor<SqlNode> {
  static readonly #AGGREGATES = ImmutableSet.of("min", "max", "avg", "sum");

  #scopes: Stack<[args: readonly Expression[], projection: SqlNode]> = Stack();
  #locals: Stack<readonly any[]> = Stack();

  #localParams: List<any> = List();
  #conversions: Map<number, Converter> = Map();
  #options?: QueryOptions | undefined;

  #paramCount = 0;

  #projection!: SqlNode;
  #groupBy?: SqlNode | undefined;

  #cardinality: Cardinality = "many";

  constructor(
    private readonly context: CompilationContext,
    private readonly argsMap = List(),
    private readonly locals = false
  ) {
    super();

    this.#paramCount = this.argsMap.size > 0 ? this.argsMap.size - 1 : 0;
  }

  compile(expr: Expression) {
    let sql = this.visit(expr)
      .accept(new SqlNullSemantics())
      .accept(new OrderByLifter())
      .accept(new EagerLoader(this.context));

    sql = new SqlOptimizer().optimize(sql);

    return {
      sql,
      cardinality: this.#cardinality,
      locals: this.#localParams,
      conversions: this.#conversions,
    };
  }

  compileFragment(expr: Expression, projection: SqlNode) {
    this.#projection = projection;
    return this.visit(expr);
  }

  protected override visitArrowExpression(expr: ArrowFunctionExpression) {
    const oldProjection = this.#projection;
    this.#scopes = this.#scopes.push([expr.params!, this.#projection]);

    try {
      return this.scopedVisit(expr.body);
    } finally {
      this.#scopes = this.#scopes.pop();
      this.#projection = oldProjection;
    }
  }

  scopedVisit(expr: Expression) {
    let node = super.visit(expr);

    if (node instanceof SqlSelect && node.projection instanceof SqlComposite) {
      const alias = this.context.createAlias();

      let projection = new SqlFunction(
        "json_array",
        List.of(node.projection.scope(alias)),
        new SqlBinding({ element: node.projection, type: "json" })
      );

      if (node.binding?.model instanceof NavigationPropertyModel && node.binding.model.many) {
        projection = new SqlFunction(
          "json_arrayagg",
          List.of(projection),
          new SqlBinding({ klass: Array, element: projection, type: "json" })
        );
      }

      node = new SqlSelect({
        projection: projection.identify(n => this.context.identify(n)),
        from: new SqlAlias(node, alias),
      });
    }

    return node;
  }

  protected override visitArrayExpression(expr: ArrayExpression) {
    return new SqlComposite(
      List(
        expr.elements.map(p => {
          const node = this.scopedVisit(p);

          invariant(node, `Couldn't compile expression: '${printExpr(p)}'!`);

          return node;
        })
      )
    );
  }

  protected override visitObjectExpression(expr: ObjectExpression) {
    return new SqlComposite(
      List(
        expr.properties.map(p => {
          const name = (p.key as IdentifierExpression).name;
          const value = this.scopedVisit(p.value! as PropertyExpression);

          return value.bind(
            new SqlBinding({
              name,
              type: value.type,
              klass: value.binding?.klass,
              element: value.binding?.element,
            })
          );
        })
      ),
      new SqlBinding({ klass: Object })
    );
  }

  #nameIndex(expressions: readonly Expression[], name: string): number {
    let i = 0;

    while (i < expressions.length) {
      const expr = expressions[i]!;

      if (expr.type === "IdentifierExpression") {
        const identifier = expr as IdentifierExpression;

        if (identifier.name === name) {
          return i;
        }
      } else if (expr.type === "ArrayExpression") {
        const j = this.#nameIndex((expr as ArrayExpression).elements, name);

        if (j !== -1) {
          return j + i;
        }
      }

      i++;
    }

    return -1;
  }

  *#nodes(node: SqlNode): Generator<SqlNode> {
    if (node.binding?.join) {
      const composite = node as SqlComposite;

      for (const child of composite.nodes) {
        yield* this.#nodes(child);
      }
    } else {
      yield node;
    }
  }

  #resolve(scope: readonly [readonly Expression[], SqlNode], name: string) {
    const [expressions, projection] = scope;
    const index = this.#nameIndex(expressions, name);

    if (index === -1) {
      return undefined;
    }

    const nodes = [...this.#nodes(projection)];
    const node = nodes[index];

    if (node) {
      return node;
    }

    const locals = this.#locals.peek();

    if (locals) {
      const i = index - nodes.length;

      if (i < locals.length) {
        const value = locals[i];

        this.#localParams = this.#localParams.push(value);

        return new SqlParameter(
          this.#paramCount++,
          new SqlBinding({
            model: this.context.metadata.model.conversion(value?.constructor),
          })
        );
      }
    }

    return new SqlParameter(-1);
  }

  protected override visitIdentifierExpression(expr: IdentifierExpression) {
    const index = this.argsMap.keyOf(expr.name);

    if (index != undefined) {
      return new SqlParameter(index - 1);
    }

    for (const scope of this.#scopes) {
      const node = this.#resolve(scope, expr.name);

      if (node) {
        return node;
      }
    }

    if (expr.name === "Date") {
      return SqlNull.INSTANCE;
    }

    throw new Error(
      `Unbound identifier '${expr.name}'. Local variables are not supported. Use parameters instead.`
    );
  }

  protected override visitMemberExpression(expr: MemberExpression) {
    let index = expr.computed ? ((expr.property as LiteralExpression).value as number) : undefined;
    const node = this.visit(expr.object);
    const identifier = expr.property as IdentifierExpression;

    if (node instanceof SqlComposite) {
      if (index !== undefined) {
        return node.nodes.get(index)!;
      }

      const member = node.resolve(identifier.name);

      if (!member) {
        if (this.#groupBy && identifier.name === "key") {
          return this.#groupBy;
        }

        const subquery = this.#tryCompileNavigation(identifier.name, node);

        if (subquery) {
          return subquery;
        }

        throw new Error(`Couldn't bind member '${identifier.name}' in '${printExpr(expr)}'.`);
      }

      return member;
    }

    const element = node.binding?.element;

    if (element) {
      let type: SqlType | undefined;

      if (index !== undefined) {
        if (element instanceof SqlComposite) {
          const target = element.getByIndex(index);

          if (!target.type && target instanceof SqlComposite) {
            return node.bind(new SqlBinding({ element: target }));
          }
        }

        type = element.type;
      } else if (element instanceof SqlComposite) {
        const [target, i] = element.getByName(identifier.name);
        index = i;
        type = target.type;

        if (!type && target instanceof SqlComposite) {
          return node.bind(new SqlBinding({ element: target }));
        }
      }

      const op: SqlBinaryOperator = type === "json" ? "->" : "->>";
      type = type === "json" ? "json" : "text";

      return sqlBin(node, op, new SqlNumber(index!), element.binding?.withType(type));
    }

    if (node instanceof SqlSelect && node.projection instanceof SqlComposite) {
      const composite = node.projection;
      const member = composite.resolve(identifier.name);

      if (!member) {
        const subquery = this.#tryCompileNavigation(identifier.name, composite);

        if (subquery) {
          return node
            .withProjection(subquery.projection)
            .addJoins(new SqlJoin("inner", subquery.from!, subquery.where!));
        }

        if (identifier.name === "length") {
          return new SqlSelect({
            projection: new SqlFunction("count", List.of(SqlStar.INSTANCE)),
            from: new SqlAlias(node, this.context.createAlias()),
          });
        }

        throw new Error(`Couldn't bind member '${identifier.name}' in '${printExpr(expr)}'.`);
      }

      const alias = this.context.createAlias();
      const from = new SqlAlias(node, alias);
      const projection = member.scope(alias);

      return new SqlSelect({ from, projection });
    }

    if (node instanceof SqlParameter) {
      if (node.id === -1) {
        const model = this.context.metadata.model.entityByLabel(identifier.name);

        return this.selectEntity(model);
      }

      throw new Error(`Complex parameter objects are not supported: '${printExpr(expr)}'.`);
    }

    if (node instanceof SqlMember) {
      if (identifier.name === "length") {
        return new SqlFunction("length", List.of(node), new SqlBinding({ type: "integer" }));
      }
    }

    throw new Error(`Unsupported member expression '${printExpr(expr)}'.`);
  }

  #tryCompileNavigation(name: string, node: SqlComposite) {
    const model = node.binding?.model;

    if (model instanceof EntityModel) {
      const property = model.allProperties.find(p => p.name === name);

      if (property instanceof NavigationPropertyModel) {
        const select = this.selectEntity(property.target);
        const projection = select.projection as SqlComposite;
        const pks = property.foreignKey.references.key!.properties;
        const fks = property.foreignKey.properties;
        const lhs = property.many ? pks : fks;
        const rhs = property.many ? fks : pks;

        const condition = lhs
          .zip(rhs)
          .map(([l, r]) => sqlBin(node.resolve(l.name)!, "=", projection.resolve(r.name)!))
          .reduce((acc: SqlNode, next) => (acc ? sqlBin(acc, "and", next) : next));

        return select
          .withWhere(condition)
          .bind(select.binding!.merge(new SqlBinding({ model: property })));
      }
    }

    return undefined;
  }

  protected override visitEntityExpression(expr: EntityExpression) {
    const model = this.context.metadata.model.entity(expr.name);

    return this.selectEntity(model);
  }

  selectEntity(entity: EntityModel) {
    const alias = this.context.createAlias();

    let projection = this.#propertiesToSql(entity, alias);

    invariant(entity.table, `Entity '${entity.name}' has no table!`);

    let predicate: SqlNode | undefined;

    const disabledConditions = this.#options?.disabledConditions ?? [];

    if (disabledConditions !== "all") {
      predicate = entity.conditions
        .filter(c => !c.name || !disabledConditions.includes(c.name))
        .map(c => this.compileFragment(parse(c.condition.toString()), projection))
        .reduce((acc: SqlNode, next) => (acc ? sqlBin(acc, "and", next) : next));
    }

    return new SqlSelect(
      {
        projection,
        from: new SqlAlias(sqlId(entity.table), alias),
        where: predicate,
      },
      projection.binding
    );
  }

  #propertiesToSql(model: StructuralModel, alias: SqlIdentifier, name?: string): SqlNode {
    return new SqlComposite(
      List(
        this.context.metadata.inheritance
          .queryableProperties(model)
          .map(p => {
            if (p instanceof ScalarPropertyModel) {
              return new SqlMember(
                alias,
                new SqlIdentifier(
                  p.column!,
                  new SqlBinding({
                    name: p.name,
                    nullable: p.nullable,
                    type: p.type,
                    model: p,
                  })
                )
              );
            }

            if (p instanceof ValueObjectPropertyModel) {
              return this.#propertiesToSql(p.target, alias, p.name);
            }

            return undefined;
          })
          .filter(n => n !== undefined) as List<SqlNode>
      ),
      new SqlBinding({ klass: model.klass, model, name })
    );
  }

  protected override visitCallExpression(expr: CallExpression) {
    if (expr.callee.type === "MemberExpression") {
      const member = expr.callee as MemberExpression;

      if (member.property.type === "IdentifierExpression") {
        const arity = expr.arguments.length;
        const arity0 = arity === 0;
        const arity1 = arity === 1;
        const arity2 = arity === 2;
        const arity0or1 = arity0 || arity1;
        const arity1or2 = arity1 || arity2;

        const op = (member.property as IdentifierExpression).name;

        let noopCall = false;

        if (op === "options" && arity1) {
          if (this.#options) {
            throw new Error("Query options can only be applied once.");
          }

          this.#options = (expr.arguments[0] as ConstantExpression).value as QueryOptions;

          noopCall = true;
        }

        let object = this.visit(member.object);

        if (noopCall) {
          return object;
        }

        if (object instanceof SqlSelect) {
          const alias = this.context.createAlias();
          const from = new SqlAlias(object, alias);
          const projection = object.projection?.scope(alias);

          this.#projection = projection;

          if (op === "sql" && arity2) {
            const fragments = (expr.arguments[0] as ConstantExpression).value as string[];
            const expressions = (expr.arguments[1] as ConstantExpression).value as any[];

            return object.withFrom(
              new SqlAlias(
                new SqlRaw(
                  List(fragments),
                  List(
                    expressions.map(expr => {
                      if (this.locals) {
                        this.#localParams = this.#localParams.push(expr);

                        return new SqlParameter(
                          this.#paramCount++,
                          new SqlBinding({
                            model: this.context.metadata.model.conversion(expr?.constructor),
                          })
                        );
                      } else {
                        if (expr.type === "IdentifierExpression") {
                          return this.visit(expr);
                        } else if (expr.type === "LiteralExpression") {
                          expr = expr.value;
                        } else {
                          throw new Error(
                            `Unsupported template parameter expression: '${printExpr(expr)}'`
                          );
                        }

                        const [node] = primitiveToSql(expr, this.context.metadata.model);

                        return node;
                      }
                    })
                  )
                ),
                (object.from as SqlAlias).alias
              )
            );
          }

          if (op === "select" && arity1or2) {
            return this.#withLocals(expr, () => {
              const projection = this.context.uniquify(
                this.visit(expr.arguments[0]).identify(n => this.context.identify(n))
              );

              return new SqlSelect({
                projection,
                from,
              });
            });
          }

          if (op === "with" && arity1) {
            const select = (from as SqlAlias).target as SqlSelect;
            const projection = select.projection;
            const binding = projection.binding;

            if (projection instanceof SqlComposite && binding?.model instanceof EntityModel) {
              const path = new WithParser(binding.model).visit(expr.arguments[0]);
              const graph = (projection.binding?.load ?? LoadNode.create()).addPath(path);

              return select.withProjection(projection.bind(new SqlBinding({ load: graph })));
            }

            return select;
          }

          if ((op === "join" || op == "leftJoin") && arity2) {
            const rhs = this.context.createAlias();

            const oldProjection = this.#projection;

            const target = this.visit(expr.arguments[0]) as SqlSelect;

            this.#projection = oldProjection;

            let nodes =
              this.#projection instanceof SqlComposite &&
              !this.#projection.binding?.klass &&
              this.#projection.nodes.every(n => n instanceof SqlComposite)
                ? this.#projection.nodes
                : List.of(this.#projection);

            nodes = nodes.push(target.projection.scope(rhs));

            this.#projection = new SqlComposite(nodes, new SqlBinding({ join: true }));

            const join = new SqlJoin(
              op == "leftJoin" ? "left" : "inner",
              new SqlAlias(target, rhs),
              this.visit(expr.arguments[1])
            );

            const projection = this.context.uniquify(this.#projection);

            return new SqlSelect({
              projection,
              from,
              joins: List.of(join),
            });
          }

          if (op === "groupBy" && arity1or2) {
            const groupBy = this.visit(expr.arguments[0]);

            this.#groupBy = groupBy;

            let selector = expr.arguments[1] as ArrowFunctionExpression | undefined;

            if (!selector) {
              const key = expr.arguments[0] as ArrowFunctionExpression;
              const params = key.params!.map(p => (p as IdentifierExpression).name).join(", ");
              const result = key.params!.length === 1 ? params : `[${params}]`;

              selector = parse(
                `g => ({ key: g.key, items: g.array((${params}) => ${result}) })`
              ) as ArrowFunctionExpression;
            } else if (selector.body.type === "IdentifierExpression") {
              error(
                `Unable to compile the identity 'groupBy' result expression: '${printExpr(expr.arguments[1]!)}'.
                 Use the 'groupBy' overload that omits the result expression.`
              );
            }

            const result = this.visit(selector);

            const projection = this.context.uniquify(
              result.identify(n => this.context.identify(n))
            );

            this.#groupBy = undefined;

            return new SqlSelect({
              projection,
              from,
              groupBy,
            });
          }

          if (op === "array" && arity0) {
            let element = projection;

            if (element instanceof SqlComposite) {
              element = new SqlFunction(
                "json_array",
                List.of(element),
                new SqlBinding({ element, type: "json" })
              );
            }

            const array = new SqlFunction(
              "json_arrayagg",
              List.of(element),
              new SqlBinding({ klass: Array, element, type: "json" })
            ).identify(n => this.context.identify(n));

            return new SqlSelect({
              projection: array,
              from,
            });
          }

          if (op === "count" && arity0) {
            if (this.#scopes.isEmpty()) {
              this.#cardinality = "one";
            }

            return new SqlSelect({
              projection: new SqlFunction("count", List.of(SqlStar.INSTANCE)),
              from,
            });
          }

          if (ExpressionCompiler.#AGGREGATES.contains(op) && arity0or1) {
            let projection: SqlNode;

            if (arity1) {
              projection = this.visit(expr.arguments[0]);
            } else {
              projection = this.#projection;

              if (!(projection instanceof SqlMember) || !isNumeric(projection.type)) {
                error(`Aggregate function '${op}' requires a scalar numeric input expression.`);
              }
            }

            if (this.#scopes.isEmpty()) {
              this.#cardinality = "one";
            }

            return new SqlSelect({
              projection: new SqlFunction(op, List.of(projection)),
              from,
            });
          }

          if (op === "any" && (arity0 || arity1or2)) {
            if (this.#scopes.isEmpty()) {
              this.#cardinality = "one";
            }

            let select = object;

            return this.#withLocals(expr, () => {
              if (arity1or2) {
                select = new SqlSelect({
                  projection,
                  from,
                  where: this.visit(expr.arguments[0]),
                });
              }

              return new SqlSelect({
                projection: new SqlExists(select),
              });
            });
          }

          if (op === "all" && arity1or2) {
            if (this.#scopes.isEmpty()) {
              this.#cardinality = "one";
            }

            return this.#withLocals(expr, () => {
              const select = new SqlSelect({
                projection,
                from,
                where: new SqlNot(this.visit(expr.arguments[0])),
              });

              return new SqlSelect({
                projection: new SqlNot(new SqlExists(select)),
              });
            });
          }

          if (op === "distinct" && arity0) {
            return new SqlSelect({
              projection,
              from,
              distinct: true,
            });
          }

          if (op === "where" && arity1or2) {
            return this.#withLocals(expr, () => {
              const where = this.visit(expr.arguments[0]);

              return new SqlSelect({ projection, from, where });
            });
          }

          if (op === "orderBy" && arity1or2) {
            return this.#withLocals(
              expr,
              () =>
                new SqlSelect({
                  projection,
                  from,
                  orderBy: new SqlOrderBy(
                    List.of(
                      this.visit(expr.arguments[0]).map(n => new SqlOrdering(n)) as SqlOrdering
                    )
                  ),
                })
            );
          }

          if (op === "orderByDesc" && arity1or2) {
            return this.#withLocals(
              expr,
              () =>
                new SqlSelect({
                  projection,
                  from,
                  orderBy: new SqlOrderBy(
                    List.of(
                      this.visit(expr.arguments[0]).map(
                        n => new SqlOrdering(n, true)
                      ) as SqlOrdering
                    )
                  ),
                })
            );
          }

          if (op === "limit" && arity1) {
            let limit = this.visit(expr.arguments[0]);

            if (limit instanceof SqlNumber) {
              this.#localParams = this.#localParams.push(limit.value);
              limit = new SqlParameter(this.#paramCount++);
            }

            return new SqlSelect({
              projection,
              from,
              limit,
            });
          }

          if (op === "offset" && arity1) {
            let offset = this.visit(expr.arguments[0]);

            if (offset instanceof SqlNumber) {
              this.#localParams = this.#localParams.push(offset.value);
              offset = new SqlParameter(this.#paramCount++);
            }

            return new SqlSelect({
              projection,
              from,
              offset,
            });
          }

          if (op === "first" && (arity0 || arity1or2)) {
            if (this.#scopes.isEmpty()) {
              this.#cardinality = "one";
            } else {
              throw new Error(
                "The operator 'first' is not supported in sub-queries. " +
                  "Use 'maybeFirst' in case the sub-query returns no results."
              );
            }

            return this.#withLocals(expr, () => {
              return new SqlSelect({
                projection,
                from,
                limit: SqlNumber.ONE,
                where: this.visit(expr.arguments[0]),
              });
            });
          }

          if (op === "maybeFirst" && (arity0 || arity1or2)) {
            if (this.#scopes.isEmpty()) {
              this.#cardinality = "optional";
            }

            return this.#withLocals(expr, () => {
              return new SqlSelect({
                projection,
                from,
                limit: SqlNumber.ONE,
                where: this.visit(expr.arguments[0]),
              });
            });
          }

          if (op === "single" && (arity0 || arity1or2)) {
            if (this.#scopes.isEmpty()) {
              this.#cardinality = "one";
            } else {
              throw new Error(
                "The operator 'single' is not supported in sub-queries. " +
                  "Use 'maybeSingle' in case the sub-query returns no results."
              );
            }

            return this.#withLocals(expr, () => {
              return new SqlSelect({
                projection,
                from,
                limit: new SqlNumber(2),
                where: this.visit(expr.arguments[0]),
              });
            });
          }

          if (op === "maybeSingle" && (arity0 || arity1or2)) {
            if (this.#scopes.isEmpty()) {
              this.#cardinality = "optional";
            }

            return this.#withLocals(expr, () => {
              return new SqlSelect({
                projection,
                from,
                limit: new SqlNumber(2),
                where: this.visit(expr.arguments[0]),
              });
            });
          }
        } else {
          if (op === "substring" && arity1or2) {
            const args = expr.arguments.map(a => this.visit(a));
            args[0] = sqlBin(args[0]!, "+", SqlNumber.ONE);

            return new SqlFunction("substr", List.of(object, ...args));
          }

          if (op === "includes" && arity1) {
            const operand = this.visit(expr.arguments[0]);

            return new SqlIn(operand, object);
          }

          if (op === "like" && arity1) {
            const pattern = this.visit(expr.arguments[0]);

            return new SqlLike(object, pattern);
          }

          if (op === "count" && arity0) {
            return new SqlFunction(
              "count",
              List.of(SqlStar.INSTANCE),
              new SqlBinding({ type: "integer" })
            );
          }

          if (op === "array" && arity0or1) {
            let selector = expr.arguments[0];

            if (!selector) {
              selector = {
                type: "ArrowFunctionExpression",
                params: [{ type: "IdentifierExpression", name: "g" }],
                body: { type: "IdentifierExpression", name: "g" },
              };
            }

            let element = this.visit(selector);

            if (element instanceof SqlComposite) {
              element = new SqlFunction(
                "json_array",
                List.of(element),
                new SqlBinding({ element, type: "json" })
              );
            }

            return new SqlFunction(
              "json_arrayagg",
              List.of(element),
              new SqlBinding({ klass: Array, element, type: "json" })
            );
          }

          if (ExpressionCompiler.#AGGREGATES.contains(op) && arity1) {
            return new SqlFunction(
              op,
              List.of(this.visit(expr.arguments[0])),
              new SqlBinding({ type: "numeric" })
            );
          }

          if (op === "now" && arity0) {
            return new SqlFunction("now", List.of());
          }
        }

        throw new Error(`Function '${op}/${arity}' is not supported in query expressions.`);
      }
    }

    throw new Error(`Function '${expr.callee}' is not supported.`);
  }

  #inBinary = false;

  protected override visitBinaryExpression(expr: BinaryExpression) {
    this.#inBinary = true;

    let left = this.scopedVisit(expr.left);
    let op = ExpressionCompiler.#mapOp(expr.operator);
    let right = this.scopedVisit(expr.right);

    this.#inBinary = false;

    if (left.binding?.model instanceof ScalarPropertyModel) {
      const scalarProperty = left.binding.model;

      if (scalarProperty.convert) {
        right = this.#applyConversion(right, scalarProperty.convert);
      }
    } else if (right.binding?.model instanceof ScalarPropertyModel) {
      const scalarProperty = right.binding.model;

      if (scalarProperty.convert) {
        left = this.#applyConversion(left, scalarProperty.convert);
      }
    }

    if (op === "=") {
      if (right instanceof SqlNull) {
        return left.apply(SqlIsNull);
      }

      if (left instanceof SqlNull) {
        return right.apply(SqlIsNull);
      }
    }

    if (op === "<>") {
      if (right instanceof SqlNull) {
        return left.apply(SqlIsNotNull);
      }

      if (left instanceof SqlNull) {
        return right.apply(SqlIsNotNull);
      }
    }

    if (op === "+" && (isText(left.type) || isText(right.type))) {
      op = "||";
    }

    return left.compare(op, right);
  }

  static #mapOp(op: string): SqlBinaryOperator {
    switch (op) {
      case "===":
      case "==":
        return "=";
      case "!==":
      case "!=":
        return "<>";
      case "&&":
        return "and";
      case "||":
        return "or";
      case ">":
      case ">=":
      case "<":
      case "<=":
      case "*":
      case "/":
      case "%":
      case "+":
      case "-":
        return op;

      default:
        throw new Error(`Unsupported binary operator: '${op}'.`);
    }
  }

  protected override visitNewExpression(expr: NewExpression) {
    const nodes = [];

    for (const arg of expr.arguments) {
      const sql = this.visit(arg);

      if ("value" in sql) {
        nodes.push(sql);
      } else {
        throw new Error(`Unsupported new argument expression: '${printExpr(arg)}'.`);
      }
    }

    const identifier = expr.callee as IdentifierExpression;

    if (identifier.name === "Date") {
      // @ts-ignore
      const date = new Date(...nodes.map(n => n.value));

      return new SqlTimestamp(
        date,
        new SqlBinding({ model: this.context.metadata.model.conversion(Date) })
      );
    }

    const valueModel = this.context.metadata.model.value(identifier.name);

    if (valueModel) {
      const valueObject = new valueModel.klass(...nodes.map(n => n.value)) as any;

      return new SqlComposite(
        List(
          valueModel.properties.map(p => {
            const value = valueObject[p.name];
            const [node, conversion] = primitiveToSql(value, this.context.metadata.model);

            return this.#applyConversion(node, conversion).bind(new SqlBinding({ name: p.name }));
          })
        ),
        new SqlBinding({ klass: valueModel.klass, model: valueModel })
      );
    }

    throw new Error(`Unsupported new expression: '${printExpr(expr)}'.`);
  }

  protected override visitLiteralExpression(expr: LiteralExpression) {
    const [node, conversion] = primitiveToSql(
      expr.value as Primitive,
      this.context.metadata.model,
      expr.raw
    );

    return this.#applyConversion(node, conversion);
  }

  #applyConversion(node: SqlNode, conversion?: ConversionModel) {
    if (!this.#inBinary && conversion) {
      if (node instanceof SqlParameter) {
        this.#conversions = this.#conversions.set(node.id, conversion.write);
      } else if ("value" in node) {
        [node] = primitiveToSql(conversion.write(node.value), this.context.metadata.model);
      }

      return node.bind(new SqlBinding({ ...node.binding, model: conversion }));
    }

    return node;
  }

  #withLocals(call: CallExpression, sql: () => SqlNode) {
    const last = call.arguments[call.arguments.length - 1];
    const constant = last as ConstantExpression;

    if (constant) {
      this.#locals = this.#locals.push(constant.value);
    }

    try {
      return sql();
    } finally {
      if (constant) {
        this.#locals = this.#locals.pop();
      }
    }
  }

  protected override visitTemplateLiteralExpression(expr: TemplateLiteralExpression) {
    const parts = expr.quasis
      .map((te, i) => {
        const quasi = te.value.cooked.length > 0 ? this.visit(te) : undefined;
        const e = i < expr.expressions.length ? this.visit(expr.expressions[i]) : undefined;

        return quasi && e ? sqlBin(quasi, "||", e) : (quasi ?? e)!;
      })
      .filter(p => p !== undefined);

    return parts.length > 0
      ? parts.reduce((acc: SqlNode, next) => (acc ? sqlBin(acc, "||", next) : acc))
      : SqlString.EMPTY;
  }

  protected override visitTaggedTemplateExpression(expr: TaggedTemplateExpression) {
    return this.visit({
      type: "CallExpression",
      callee: expr.tag,
      arguments: [
        constant(expr.quasi.quasis.map(t => t.value.cooked)),
        constant(expr.quasi.expressions),
      ],
    });
  }

  protected override visitUnaryExpression(expr: UnaryExpression) {
    if (expr.prefix && expr.operator === "-") {
      if (expr.argument.type === "LiteralExpression") {
        return new SqlNumber(-expr.argument["value"]!);
      }

      return new SqlNegation(this.visit(expr.argument));
    }

    if (expr.prefix && expr.operator === "!") {
      return new SqlNot(this.visit(expr.argument));
    }

    throw new Error(`Unary operator '${expr.operator}' is not supported.`);
  }

  protected override visitTemplateExpression(expr: TemplateExpression) {
    return sqlStr(expr.value.cooked);
  }

  protected override visitSpreadExpression(_: SpreadExpression): SqlNode {
    throw new Error("Spread expressions are not supported in queries.");
  }
}

class WithParser extends ExpressionVisitor<List<NavigationPropertyModel>> {
  #scope!: string;

  constructor(private model: EntityModel) {
    super();
  }

  protected override visitArrowExpression(expr: ArrowFunctionExpression) {
    const oldScope = this.#scope;

    this.#scope = (expr.params![0] as IdentifierExpression).name;

    try {
      return this.visit(expr.body);
    } finally {
      this.#scope = oldScope;
    }
  }

  protected override visitCallExpression(expr: CallExpression) {
    const member = expr.callee as MemberExpression;
    const name = (member.property as IdentifierExpression).name;

    if (name === "with") {
      const path = this.visit(member.object);

      return path.concat(this.visit(expr.arguments[0]));
    }

    throw new Error(`Function '${name}' is not supported in 'with' expressions.`);
  }

  protected override visitMemberExpression(expr: MemberExpression) {
    const property = (expr.property as IdentifierExpression).name;

    if (expr.object.type === "IdentifierExpression") {
      const scope = (expr.object as IdentifierExpression).name;

      if (scope === this.#scope) {
        const navigation = this.model.navigation(property);

        this.model = navigation.target;

        return List.of(navigation);
      } else {
        throw new Error(`Invalid with expression parameter '${scope}'.`);
      }
    } else {
      const path = this.visit(expr.object);
      const navigation = this.model.navigation(property);

      this.model = navigation.target;

      return path.concat(navigation);
    }
  }

  override visit(expr?: Expression): List<NavigationPropertyModel> {
    const path = super.visit(expr);

    if (!path) {
      throw new Error(`Invalid with expression: '${printExpr(expr!)}'.`);
    }

    return path;
  }
}
