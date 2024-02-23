import { ArrowExpression } from "@jsep-plugin/arrow";
import { NewExpression } from "@jsep-plugin/new";
import { ObjectExpression } from "@jsep-plugin/object";
import { SpreadElement } from "@jsep-plugin/spread";
import { TemplateElement, TemplateLiteral } from "@jsep-plugin/template";
import { List, Map, Set as ImmutableSet, Stack } from "immutable";
import jsep, {
  ArrayExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  Identifier,
  Literal,
  MemberExpression,
  UnaryExpression,
} from "jsep";
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
import { ConstantExpression, EntityExpression, ExpressionVisitor } from "./expression.js";
import { printExpr } from "./printer.js";
import { __expr, AbstractQueryable, AsyncSequence } from "./queryable.js";
import { Shaper, ShaperCompiler, ShaperContext } from "./shaping.js";

export class QueryCompiler {
  constructor(
    private readonly metadata: Metadata,
    private readonly from: From
  ) {}

  compile<A extends unknown[]>(query: (from: From, ...args: A) => unknown, localParams = true) {
    const queryJS = query.toString();
    const arrowIndex = queryJS.indexOf("=>");

    if (arrowIndex === -1) {
      throw new Error("Query expression must be an arrow function.");
    }

    const params = queryJS.substring(0, arrowIndex);
    const arrowJs = `${params}=> {}`;
    const arrowExpr = jsep(arrowJs) as ArrowExpression;
    const queryable = (query as (from: From, ...args: unknown[]) => AbstractQueryable)(this.from);
    const expr = queryable[__expr]();

    this.metadata.config.logger?.debug(expr);

    const argsMap = List(arrowExpr.params?.map(e => (e as Identifier).name));

    const compiler = new ExpressionCompiler(
      new CompilationContext(this.metadata),
      argsMap,
      localParams
    );

    const { sql, cardinality, arity, locals, conversions } = compiler.compile(expr);

    const shaper = new ShaperCompiler().compile(sql);

    this.metadata.config.logger?.debug(shaper.toString() + "\n");

    const rows = this.#rowFn(sql, arity, locals, conversions, this.metadata.model);

    if (cardinality !== "many") {
      return async (args: A[], cache?: QueryCache) =>
        this.#one(args, rows, shaper, cardinality, cache);
    }

    return (args: A[], cache?: QueryCache) =>
      new AsyncSequenceImpl(this.#many(args, rows, shaper, cache));
  }

  #rowFn(
    sql: SqlNode,
    arity: number,
    locals: List<Primitive>,
    conversions: Map<number, Converter>,
    model: Model
  ) {
    return (args: unknown[]) => {
      const allArgs = Array(arity).fill(null);

      allArgs.forEach((_, i) => {
        if (args[i] !== undefined) {
          allArgs[i] = args[i];
        } else if (locals.get(i) !== undefined) {
          allArgs[i] = locals.get(i);
        }

        const converter = conversions.get(i) ?? model.conversion(allArgs[i]?.constructor)?.write;

        if (converter) {
          allArgs[i] = converter(allArgs[i]);
        }
      });

      return this.metadata.config.driver.rows(sql)(allArgs);
    };
  }

  async #one(
    args: unknown[],
    rows: (args: unknown[]) => AsyncIterable<unknown[]>,
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
    args: unknown[],
    rows: (args: unknown[]) => AsyncIterable<unknown[]>,
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

export class RowIterator implements AsyncIterator<unknown[]> {
  private iterator: AsyncIterator<unknown[]>;
  private nextValue?: Promise<IteratorResult<unknown[]>> | undefined;

  constructor(iterator: AsyncIterator<unknown[]>) {
    this.iterator = iterator;
  }

  async peek(): Promise<IteratorResult<unknown[]>> {
    if (!this.nextValue) {
      this.nextValue = this.iterator.next();
    }

    return this.nextValue;
  }

  async next(): Promise<IteratorResult<unknown[]>> {
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

class Scope {
  constructor(
    readonly projection: SqlNode,
    readonly name?: string,
    readonly children: List<Scope> = List()
  ) {}

  contains(name: string): boolean {
    return this.name === name || this.children.some(c => c.contains(name));
  }

  resolve(name: string, composite: SqlComposite) {
    if (name === this.name) {
      return composite;
    }

    let resolved: SqlComposite | undefined;

    for (let i = 0; i < this.children.size; i++) {
      resolved = this.children.get(i)!.resolve(name, composite.nodes.get(i) as SqlComposite);

      if (resolved) {
        break;
      }
    }

    return resolved;
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

  #scopes: Stack<Scope> = Stack();

  #locals: Stack<Map<string, any>> = Stack();
  #localParams: List<any> = List();
  #conversions: Map<number, Converter> = Map();
  #configuration?: QueryOptions | undefined;

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
      arity: this.#paramCount,
      locals: this.#localParams,
      conversions: this.#conversions,
    };
  }

  compileFragment(expr: Expression, projection: SqlNode) {
    this.#projection = projection;
    return this.visit(expr);
  }

  protected override visitArrowExpression(expr: ArrowExpression) {
    this.#scopes = this.#scopes.push(this.scopes(expr.params!));

    try {
      return this.scopedVisit(expr.body);
    } finally {
      this.#scopes = this.#scopes.pop();
    }
  }

  private scopes(params: Expression[]): Scope {
    const scopes = params.map(p => {
      if (p.type === "Identifier") {
        return new Scope(this.#projection, (p as Identifier).name);
      }

      if (p.type === "ArrayExpression") {
        return this.scopes((p as ArrayExpression).elements);
      }

      throw new Error(`Unsupported scope expression type: ${p.type}`);
    });

    if (scopes.length === 1) {
      return scopes[0]!;
    }

    return new Scope(this.#projection, undefined, List(scopes));
  }

  scopedVisit(expr: Expression) {
    const oldProjection = this.#projection;

    try {
      let node = super.visit(expr);

      if (node instanceof SqlSelect && node.projection instanceof SqlComposite) {
        const alias = this.context.createAlias();

        const projection = new SqlFunction(
          "json_array",
          List.of(node.projection.record().scope(alias)),
          new SqlBinding({ element: node.projection, type: "json" })
        ).identify(n => this.context.identify(n));

        node = new SqlSelect({
          projection,
          from: new SqlAlias(node, alias),
        });
      }

      return node;
    } finally {
      this.#projection = oldProjection;
    }
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
          const name = (p.key as Identifier).name;
          const value = this.scopedVisit(p.value!);

          return value.bind(new SqlBinding({ name, type: value.type }));
        })
      ),
      new SqlBinding({ klass: Object })
    );
  }

  protected override visitIdentifier(expr: Identifier) {
    const index = this.argsMap.keyOf(expr.name);

    if (index != undefined) {
      if (index > 0) {
        this.#paramCount++;
      }

      return new SqlParameter(index - 1);
    }

    const scopeIndex = this.#scopes.findIndex(s => s.contains(expr.name));

    if (scopeIndex != -1) {
      const scope = this.#scopes.get(scopeIndex)!;

      if (scope.projection instanceof SqlComposite) {
        const composite = scope.resolve(expr.name, scope.projection)!;

        return composite.record();
      }

      return scope.projection;
    }

    const locals = this.#locals.peek();

    if (locals?.has(expr.name)) {
      const value = locals.get(expr.name);
      this.#localParams = this.#localParams.push(value);

      return new SqlParameter(
        this.#paramCount++,
        new SqlBinding({
          model: this.context.metadata.model.conversion(value?.constructor),
        })
      );
    }

    if (expr.name === "Date") {
      return SqlNull.INSTANCE;
    }

    throw new Error(
      `Unbound identifier '${expr.name}'. Local variables are not supported. Use parameters instead.`
    );
  }

  protected override visitMemberExpression(expr: MemberExpression) {
    let index = expr.computed ? ((expr.property as Literal).value as number) : undefined;
    const node = this.visit(expr.object);
    const identifier = expr.property as Identifier;

    if (node instanceof SqlComposite) {
      if (index !== undefined) {
        return node.nodes.get(index)!;
      }

      const member = node.resolve(identifier.name);

      if (!member) {
        if (this.#groupBy && identifier.name === "key") {
          return this.#groupBy;
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

    if (node instanceof SqlSelect) {
      if (node.projection instanceof SqlComposite) {
        const member = node.projection.resolve(identifier.name);

        if (!member) {
          throw new Error(`Couldn't bind member '${identifier.name}' in '${printExpr(expr)}'.`);
        }

        const alias = this.context.createAlias();
        const from = new SqlAlias(node, alias);
        const projection = member.scope(alias);

        return new SqlSelect({ from, projection });
      }
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

  protected override visitEntityExpression(expr: EntityExpression) {
    const model = this.context.metadata.model.entity(expr.name);

    return this.selectEntity(model);
  }

  selectEntity(entity: EntityModel) {
    const alias = this.context.createAlias();

    let projection = this.#propertiesToSql(entity, alias);

    invariant(entity.table, `Entity '${entity.name}' has no table!`);

    let predicate: SqlNode | undefined;

    const disabledConditions = this.#configuration?.disabledConditions ?? [];

    if (disabledConditions !== "all") {
      predicate = entity.conditions
        .filter(c => !c.name || !disabledConditions.includes(c.name))
        .map(c => this.compileFragment(jsep(c.condition.toString()), projection))
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

      if (member.property.type === "Identifier") {
        const arity0 = expr.arguments.length === 0;
        const arity1 = expr.arguments.length === 1;
        const arity2 = expr.arguments.length === 2;
        const arity1or2 = arity1 || arity2;

        const op = (member.property as Identifier).name;

        let noopCall = false;

        if (op === "configure" && arity1) {
          if (this.#configuration) {
            throw new Error("Query configuration can only be applied once.");
          }

          this.#configuration = (expr.arguments[0] as ConstantExpression).value as QueryOptions;

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
            const values = (expr.arguments[1] as ConstantExpression).value as any[];

            return object.withFrom(
              new SqlAlias(
                new SqlRaw(
                  List(fragments),
                  List(
                    values.map((v, i) => {
                      if (this.locals) {
                        this.#localParams = this.#localParams.push(v);

                        return new SqlParameter(
                          this.#paramCount++,
                          new SqlBinding({
                            model: this.context.metadata.model.conversion(v?.constructor),
                          })
                        );
                      } else {
                        if (v === undefined || v === null) {
                          error(
                            `Template parameter near SQL fragment '${fragments[i]}' is undefined.
                             Ensure parameter references use object literal syntax, e.g. { $param } instead of $param.`
                          );
                        }

                        if (typeof v === "object") {
                          const key = Object.keys(v)[0];

                          const index = this.argsMap.keyOf(key);

                          if (index != undefined) {
                            if (index > 0) {
                              this.#paramCount++;
                            }

                            return new SqlParameter(index - 1);
                          }

                          throw new Error(`Unbound parameter '${key}'.`);
                        }

                        const [node] = primitiveToSql(v, this.context.metadata.model);

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

            const nodes = List.of(this.#projection, target.projection.scope(rhs));

            this.#projection = new SqlComposite(nodes);

            const join = new SqlJoin(
              op == "leftJoin" ? "left" : "inner",
              new SqlAlias(target, rhs),
              this.visit(expr.arguments[1])
            );

            const projection = this.context.uniquify(new SqlComposite(nodes));

            return new SqlSelect({
              projection,
              from,
              joins: List.of(join),
            });
          }

          if (op === "groupBy" && arity2) {
            const groupBy = this.visit(expr.arguments[0]);

            this.#groupBy = groupBy;

            const projection = this.context.uniquify(
              this.visit(expr.arguments[1]).identify(n => this.context.identify(n))
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
            if (this.#scopes.size === 0) {
              this.#cardinality = "one";
            }

            return new SqlSelect({
              projection: new SqlFunction("count", List.of(SqlStar.INSTANCE)),
              from,
            });
          }

          if (ExpressionCompiler.#AGGREGATES.contains(op) && arity1) {
            const projection = this.visit(expr.arguments[0]);

            if (this.#scopes.size === 0) {
              this.#cardinality = "one";
            }

            return new SqlSelect({
              projection: new SqlFunction(op, List.of(projection)),
              from,
            });
          }

          if (op === "any" && (arity0 || arity1or2)) {
            if (this.#scopes.size === 0) {
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
            if (this.#scopes.size === 0) {
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
            return this.#withLocals(
              expr,
              () =>
                new SqlSelect({
                  projection,
                  from,
                  where: this.visit(expr.arguments[0]),
                })
            );
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

            if (limit instanceof SqlComposite) {
              limit = limit.nodes.first();
            }

            return new SqlSelect({
              projection,
              from,
              limit,
            });
          }

          if (op === "offset" && arity1) {
            let offset = this.visit(expr.arguments[0]);

            if (offset instanceof SqlComposite) {
              offset = offset.nodes.first();
            }

            return new SqlSelect({
              projection,
              from,
              offset,
            });
          }

          if (op === "first" && (arity0 || arity1or2)) {
            if (this.#scopes.size === 0) {
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
                limit: new SqlNumber(1),
                where: this.visit(expr.arguments[0]),
              });
            });
          }

          if (op === "maybeFirst" && (arity0 || arity1or2)) {
            if (this.#scopes.size === 0) {
              this.#cardinality = "optional";
            }

            return this.#withLocals(expr, () => {
              return new SqlSelect({
                projection,
                from,
                limit: new SqlNumber(1),
                where: this.visit(expr.arguments[0]),
              });
            });
          }

          if (op === "single" && (arity0 || arity1or2)) {
            if (this.#scopes.size === 0) {
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
            if (this.#scopes.size === 0) {
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
            args[0] = sqlBin(args[0]!, "+", new SqlNumber(1));

            return new SqlFunction("substr", List.of(object, ...args));
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

          if (op === "array" && arity1) {
            let element = this.visit(expr.arguments[0]);

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

        throw new Error(`Function '${op}' is not supported.`);
      }
    }

    throw new Error(`Function '${expr.callee}' is not supported.`);
  }

  #inBinary = false;

  protected override visitBinaryExpression(expr: BinaryExpression) {
    this.#inBinary = true;

    let left = this.scopedVisit(expr.left);
    const op = ExpressionCompiler.#mapOp(expr.operator);
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

    const identifier = expr.callee as Identifier;

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

  protected override visitLiteral(expr: Literal) {
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
    const constant = call.arguments[1] as ConstantExpression;

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

  protected override visitTemplateLiteral(expr: TemplateLiteral) {
    return expr.quasis
      .map((te, i) => {
        const quasi = te.value.raw.length > 0 ? this.visit(te) : undefined;
        const e = i < expr.expressions.length ? this.visit(expr.expressions[i]) : undefined;
        return quasi && e ? sqlBin(quasi, "||", e) : (quasi ?? e)!;
      })
      .reduce((acc: SqlNode, next) => (acc ? sqlBin(acc, "||", next) : next));
  }

  protected override visitUnaryExpression(expr: UnaryExpression) {
    if (expr.prefix && expr.operator === "-") {
      if (expr.argument.type === "Literal") {
        return new SqlNumber(-expr.argument["value"]!);
      }

      return new SqlNegation(this.visit(expr.argument));
    }

    if (expr.prefix && expr.operator === "!") {
      return new SqlNot(this.visit(expr.argument));
    }

    throw new Error(`Unary operator '${expr.operator}' is not supported.`);
  }

  protected override visitTemplateElement(expr: TemplateElement) {
    return sqlStr(expr.value.raw);
  }

  protected override visitSpreadElement(_: SpreadElement): SqlNode {
    throw new Error("Spread expressions are not supported in queries.");
  }
}

class WithParser extends ExpressionVisitor<List<NavigationPropertyModel>> {
  #scope!: string;

  constructor(private model: EntityModel) {
    super();
  }

  protected override visitArrowExpression(expr: ArrowExpression) {
    const oldScope = this.#scope;

    this.#scope = (expr.params![0] as Identifier).name;

    try {
      return this.visit(expr.body);
    } finally {
      this.#scope = oldScope;
    }
  }

  protected override visitCallExpression(expr: CallExpression) {
    const member = expr.callee as MemberExpression;
    const name = (member.property as Identifier).name;

    if (name === "with") {
      const path = this.visit(member.object);

      return path.concat(this.visit(expr.arguments[0]));
    }

    throw new Error(`Function '${name}' is not supported in 'with' expressions.`);
  }

  protected override visitMemberExpression(expr: MemberExpression) {
    const property = (expr.property as Identifier).name;

    if (expr.object.type === "Identifier") {
      const scope = (expr.object as Identifier).name;

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
