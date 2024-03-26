// noinspection JSConsecutiveCommasInArrayLiteral

import { List } from "immutable";

import invariant from "tiny-invariant";
import { Newable } from "ts-essentials";
import { TYPE_CONDITION } from "../conventions/database.js";
import { SqlAlias, SqlComposite, SqlNode, SqlNot, SqlSelect } from "../db/sql.js";
import { SqlVisitor } from "../db/visitor.js";
import { ConversionModel, EntityModel, ScalarPropertyModel } from "../model/model.js";
import { EntityKey, IdentityMap, QueryCache } from "../uow.js";
import { RowIterator } from "./compiler.js";
import { LoadNode } from "./eager.js";
import { ExpressionVisitor } from "./expression.js";
import {
  ArrowFunctionExpression,
  BinaryExpression,
  Expression,
  IdentifierExpression,
  LiteralExpression,
  MemberExpression,
  parse,
} from "./parser.js";
import { printExpr } from "./printer.js";

export class ShaperContext {
  readonly #cache: QueryCache;
  readonly useCache: boolean;

  constructor(
    readonly iterator: RowIterator,
    cache?: QueryCache
  ) {
    this.#cache = cache ?? new IdentityMap();
    this.useCache = !!cache;
  }

  get cache() {
    return this.#cache;
  }
}

export type Shaper = (row: unknown[], context: ShaperContext, useCache?: boolean) => any;

type CompilerResult = {
  fn: Shaper;
  offset: number;
};

export class ShaperCompiler extends SqlVisitor<CompilerResult, number> {
  compile(sql: SqlNode) {
    return sql.accept(this, 0).fn;
  }

  override visitNode(
    node: SqlNode,
    offset: number
  ): {
    fn: Shaper;
    offset: number;
  } {
    if (node.binding?.klass === Array) {
      const shaper = node.binding.element!.accept(this, 0);

      return {
        fn: async (row: unknown[], context: ShaperContext) => {
          const value = row[offset];

          if (!value) {
            return undefined;
          }

          const array = Array.isArray(value) ? value : (JSON.parse(value as any) as []);

          const result = [];

          for (const e of array) {
            result.push(e ? await shaper.fn([e], context) : undefined);
          }

          return result;
        },
        offset: offset + 1,
      };
    }

    if (node.binding?.element) {
      const shaper = node.binding.element!.accept(this, 0);

      return {
        fn: async (row: unknown[], context: ShaperContext) => {
          const value = row[offset];

          if (!value) {
            return undefined;
          }

          const array = Array.isArray(value) ? value : (JSON.parse(value as any) as []);

          return await shaper.fn(array as unknown[], context);
        },
        offset: offset + 1,
      };
    }

    let conversion: ConversionModel | undefined;

    if (node.binding?.model instanceof ScalarPropertyModel) {
      const scalarProperty = node.binding.model;

      if (scalarProperty.convert) {
        conversion = scalarProperty.convert;
      }
    } else if (node.binding?.model instanceof ConversionModel) {
      conversion = node.binding.model;
    }

    if (conversion) {
      return {
        fn: (row: unknown[], _: ShaperContext) =>
          conversion!.read(row[offset] === null ? undefined : row[offset]),
        offset: offset + 1,
      };
    }

    return {
      fn: (row: unknown[], _: ShaperContext) => (row[offset] === null ? undefined : row[offset]),
      offset: offset + 1,
    };
  }

  override visitComposite(composite: SqlComposite, offset: number): CompilerResult {
    if (composite.binding?.eager) {
      return composite.nodes.first()!.accept(this, offset);
    }

    const shapers: Shaper[] = [];

    for (const node of composite.nodes) {
      const shaper = node.accept(this, offset);
      shapers.push(shaper.fn);
      offset = shaper.offset;
    }

    if (composite.binding?.klass) {
      const ctor = composite.binding.klass;

      const bindings = composite.nodes
        .map((n, i) => [n.binding!.name!, shapers[i]!] as const)
        .toList();

      if (composite.binding.model instanceof EntityModel) {
        const entity = composite.binding.model as EntityModel;
        const keyProperties = entity?.key!.properties.map(p => p.name);

        let keyFn: (row: unknown[], context: ShaperContext) => EntityKey | undefined;

        if (keyProperties) {
          const keyShapers = keyProperties.map(name => {
            const index = composite.nodes.findIndex(n => n.binding?.name === name);

            return shapers[index];
          });

          keyFn = (row: unknown[], context: ShaperContext) => {
            const values = [];

            for (const shaper of keyShapers) {
              const value = shaper!(row, context);

              if (value === undefined) {
                return undefined;
              }

              values.push(value);
            }

            return List(values);
          };
        }

        const navigations = entity?.navigations ?? [];

        let factory: (row: unknown[], context: ShaperContext) => any;

        if (entity.derived.isEmpty()) {
          factory = (_: unknown[], __: ShaperContext) => new ctor();
        } else {
          const { property, map } = new TypeConditionAnalyzer().analyze(entity);
          const conditionIndex = composite.nodes.findIndex(n => n.binding?.name === property);

          const conditionShaper = shapers[conditionIndex];

          factory = async (row: unknown[], context: ShaperContext) => {
            const value = await conditionShaper!(row, context);
            const ctor = map.get(value)!;

            return new ctor();
          };
        }

        let shaper = {
          fn: async (row: unknown[], context: ShaperContext, useCache?: boolean) => {
            if (!row) {
              return undefined;
            }

            let keyValues: EntityKey | undefined;

            if (useCache || context.useCache) {
              keyValues = keyFn(row, context);

              if (keyValues) {
                const obj = context.cache.get(entity, keyValues);

                if (obj) {
                  return obj;
                }
              }
            }

            let obj = await factory(row, context);

            navigations.forEach(n => {
              obj[n.name] = n.many ? [] : undefined;
            });

            for (const binding of bindings) {
              const key = binding[0];

              invariant(key !== undefined);

              const value = await binding[1](row, context);

              if (keyProperties?.get(0) === key && value === undefined) {
                return undefined;
              }

              obj[key] = value;
            }

            if (useCache || context.useCache) {
              context.cache.set(entity, keyValues!, obj);
            }

            return obj;
          },
          offset,
        };

        const load = composite.binding.load;

        if (load && !load.navigation) {
          const shaperFn = shaper.fn;

          load.bindShaper(this);

          let fn: Shaper | undefined;

          if (load.allOnes()) {
            fn = async (row: unknown[], context: ShaperContext) =>
              onesShaper(row, context, await shaperFn(row, context, true), load);
          } else {
            let allMany = true;
            const manys: LoadNode[] = [];

            let node = load;

            while (node) {
              if (node.edges.isEmpty()) {
                break;
              }

              if (node.edges.size === 1) {
                node = node.edges.first()!;

                if (node.allOnes()) {
                  break;
                }

                if (node.many) {
                  manys.push(node);
                  continue;
                }
              }

              allMany = false;
              break;
            }

            fn = allMany
              ? async (row: unknown[], context: ShaperContext) =>
                  manysShaper(row, context, await shaperFn(row, context), manys)
              : async (row: unknown[], context: ShaperContext) =>
                  mixedShaper(row, context, shaperFn, load);
          }

          shaper = { fn, offset };
        }

        return shaper;
      }

      return {
        fn: async (row: unknown[], context: ShaperContext) => {
          let obj = new ctor() as any;

          for (const binding of bindings) {
            const key = binding[0];
            obj[key] = await binding[1](row, context);
          }

          return obj;
        },
        offset,
      };
    }

    return {
      fn: async (row: unknown[], context: ShaperContext) => {
        const result = [];

        for (const shaper of shapers) {
          result.push(await shaper(row, context));
        }

        return result;
      },
      offset,
    };
  }

  override visitAlias(alias: SqlAlias, offset: number): CompilerResult {
    return alias.target.accept(this, offset);
  }

  override visitNot(not: SqlNot, offset: number): CompilerResult {
    return not.operand.accept(this, offset);
  }

  override visitSelect(select: SqlSelect, offset: number): CompilerResult {
    return select.projection.accept(this, offset);
  }
}

class TypeConditionAnalyzer extends ExpressionVisitor {
  #param?: string;
  #typeProperty?: string;
  #entity?: EntityModel;
  #map: Map<string, Newable<unknown>> = new Map();

  analyze(entity: EntityModel) {
    entity.derived.forEach(d => this.analyze(d));

    this.#entity = entity;

    this.visit(parse(entity.condition(TYPE_CONDITION).condition as string));

    return { property: this.#typeProperty, map: this.#map };
  }

  protected override visitArrowExpression(expr: ArrowFunctionExpression) {
    if (expr.params?.length !== 1) {
      throw new Error(`Type condition must have exactly one parameter.`);
    }

    this.#param = (expr.params[0] as IdentifierExpression).name;

    this.visit(expr.body);
  }

  protected override visitBinaryExpression(expr: BinaryExpression) {
    if (expr.operator === "==" || expr.operator === "||") {
      this.visit(expr.left);
      this.visit(expr.right);
    } else {
      throw new Error(`Type condition binary expression must be an equality or disjunction.`);
    }
  }

  protected override visitMemberExpression(expr: MemberExpression) {
    const param = (expr.object as IdentifierExpression).name;

    if (this.#param !== param) {
      throw new Error(`Type condition must be on the same parameter.`);
    }

    const typeProperty = (expr.property as IdentifierExpression).name;

    if (!this.#typeProperty) {
      this.#typeProperty = typeProperty;
    } else {
      if (this.#typeProperty !== typeProperty) {
        throw new Error(`Type condition must be on the same property.`);
      }
    }
  }

  protected override visitLiteral(expr: LiteralExpression) {
    if (typeof expr.value !== "string") {
      throw new Error(`Type condition must be a string literal.`);
    }

    if (!this.#map.has(expr.value)) {
      this.#map = this.#map.set(expr.value, this.#entity!.klass);
    }
  }

  protected override visitUnhandled(expr: Expression) {
    throw new Error(`Unexpected expression '${printExpr(expr)}' in type condition.`);
  }
}

async function onesShaper(row: unknown[], context: ShaperContext, parent: any, load: LoadNode) {
  for (const edge of load.edges) {
    const item = await edge.shaper(row, context, true);

    if (item) {
      parent[edge.name] = await onesShaper(row, context, item, edge);
    } else {
      break;
    }
  }

  return parent;
}

async function manysShaper(row: unknown[], context: ShaperContext, root: any, manys: LoadNode[]) {
  const arrays: any[] = [];
  const tracking = context.useCache;

  let parent = root;

  for (let i = 0; i < manys.length; i++) {
    const item = await manys[i]!.shaper(row, context);

    if (item) {
      arrays[i] = parent[manys[i]!.name];

      if (!tracking) {
        arrays[i].push(item);
      }

      if (i < manys.length - 1) {
        parent = item;
      }

      if (i == manys.length - 1) {
        await onesShaper(row, context, item, manys[i]!);
      }
    } else if (i === 0) {
      return root;
    } else {
      break;
    }
  }

  outer: while (true) {
    const { value, done } = await context.iterator.peek();

    if (done) {
      break;
    }

    let nextItem: any;

    for (let i = manys.length - 1; i >= 0; i--) {
      let item: any;

      if (!nextItem) {
        item = await manys[i]!.shaper(value, context);

        if (!item) {
          break outer;
        }

        if (i == manys.length - 1) {
          await onesShaper(value, context, item, manys[i]!);
        }
      } else {
        item = nextItem;
        nextItem = undefined;
      }

      const lastItem = arrays[i][arrays[i].length - 1];

      if (lastItem) {
        if (lastItem[manys[i]!.groupKey] !== item[manys[i]!.groupKey]) {
          if (i === 0) {
            break outer;
          } else {
            nextItem = await manys[i - 1]!.shaper(value, context);
            arrays[i] = nextItem[manys[i]!.name];

            if (!tracking) {
              arrays[i].push(item);
            }
          }
        } else {
          if (!tracking) {
            arrays[i].push(item);
          }

          break;
        }
      } else {
        if (i === 0) {
          break outer;
        }
      }
    }

    await context.iterator.next();
  }

  return root;
}

async function mixedShaper(row: unknown[], context: ShaperContext, shaper: Shaper, load: LoadNode) {
  const root = await shaper(row, context, true);

  await rowShaper(row, context, root, load);

  while (true) {
    const { value, done } = await context.iterator.peek();

    if (done) {
      break;
    }

    let parent = await shaper(value, context, true);

    if (parent !== root) {
      break;
    }

    await rowShaper(value, context, parent, load);
    await context.iterator.next();
  }

  return root;
}

async function rowShaper(row: unknown[], context: ShaperContext, parent: any, load: LoadNode) {
  const tracking = context.useCache;

  for (const edge of load.edges) {
    let item = await edge.shaper(row, context, true);

    if (item) {
      await rowShaper(row, context, item, edge);

      if (edge.many) {
        const arr = parent[edge.name];
        if (!tracking && !arr.includes(item)) {
          arr.push(item);
        }
      } else {
        parent[edge.name] = item;
      }
    }
  }
}
