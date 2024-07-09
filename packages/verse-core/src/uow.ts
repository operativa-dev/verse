/**
 * Implements the unit of work pattern for managing changes to entities in a database.
 *
 * @packageDocumentation
 */

import { is, List, Map as ImmutableMap, OrderedMap, Seq } from "immutable";

import { ExecuteResult, ExecuteStatement, IsolationLevel } from "./db/driver.js";
import {
  sqlBin,
  SqlBinding,
  SqlDelete,
  sqlId,
  SqlInsert,
  SqlNode,
  SqlParameter,
  SqlUpdate,
} from "./db/sql.js";
import { IdGenerator } from "./identity/generator.js";
import { Identity } from "./identity/identity.js";
import { SeqHilo } from "./identity/seqhilo.js";
import { Uuid } from "./identity/uuid.js";
import {
  EntityModel,
  KeyModel,
  NavigationPropertyModel,
  PropertyModel,
  ScalarPropertyModel,
  ScalarPropertyPath,
} from "./model/model.js";
import { notNull } from "./utils/check.js";
import { error } from "./utils/utils.js";
import { Metadata } from "./verse.js";

/**
 * Represents a unique identifier for an entity.
 */
export type EntityKey = List<string | number | bigint | boolean>;

/**
 * @ignore
 */
export interface QueryCache {
  get(model: EntityModel, key: EntityKey): object | undefined;
  set(model: EntityModel, key: EntityKey, entity: object): void;
}

/**
 * @ignore
 */
export class IdentityMap implements QueryCache {
  #byName = ImmutableMap<string, ImmutableMap<EntityKey, object>>();

  get(model: EntityModel, key: EntityKey) {
    return this.#byName.get(model.name)?.get(key);
  }

  set(model: EntityModel, key: EntityKey, entity: object) {
    const byClass = this.#byName.get(model.name);

    this.#byName = this.#byName.set(
      model.name,
      byClass ? byClass.set(key, entity) : ImmutableMap([[key, entity]])
    );
  }

  remove(entityName: string, key: EntityKey) {
    const byClass = this.#byName.get(entityName);

    if (byClass) {
      this.#byName = this.#byName.set(entityName, byClass.remove(key));
    }
  }
}

/**
 * Represents the state of an entity in a unit of work.
 *
 * `added` - The entity has been added to the unit of work and will be
 * inserted into the database when the unit of work is committed.
 *
 * `modified` - The entity has been modified and will be updated in the
 * database when the unit of work is committed.
 *
 * `removed` - The entity has been removed from the unit of work and will
 * be deleted from the database when the unit of work is committed.
 *
 * `unchanged` - The entity has not been modified and will not be
 * affected when the unit of work is committed.
 */
export type EntityState = "added" | "modified" | "removed" | "unchanged";

/**
 * Methods for managing the state of an entity in a unit of work.
 */
export interface EntityEntryApi<Entity extends object> {
  /**
   * Returns the current state of the entity.
   *
   * @returns The state of the entity.
   */
  get state(): EntityState;

  /**
   * Sets the state of the entity.
   *
   * @param state The state to be set for the entity.
   */
  setState(state: EntityState): void;

  /**
   * Updates an entity with the provided values.
   *
   * @param {Partial<Entity>} values - The values to update the entity with.
   * @return {void}
   *
   * @example
   * uow.entry(album).update({title: 'Road Games', artist: 'Allan Holdsworth'});
   */
  update(values: Partial<Entity>): void;
}

class EntityEntry {
  #state: EntityState;

  #snapshot = new Map<string, any>();
  #related = new Map<string, any>();

  readonly #fixup: (entry: EntityEntry) => void;

  constructor(
    readonly entity: object,
    readonly model: EntityModel,
    state: EntityState,
    fixup: (entry: EntityEntry) => void
  ) {
    this.#state = state;
    this.#fixup = fixup;
    this.#snap();
  }

  get key() {
    return this.model.key!.keyOf(this.entity)!;
  }

  get state() {
    return this.#state;
  }

  setState(state: EntityState) {
    notNull({ state });

    if (this.#state !== state) {
      this.#state = state;
      this.#fixup(this);
    }
  }

  commit() {
    this.#snap();
    this.#state = "unchanged";
  }

  get snapshot() {
    return ImmutableMap(this.#snapshot);
  }

  update(values: Record<string, unknown>) {
    const obj = this.entity as any;

    Object.entries(values).forEach(([k, v]) => {
      if (this.#snapshot.has(k) && this.#snapshot.get(k) !== v) {
        obj[k] = v;

        if (this.#state === "unchanged") {
          this.setState("modified");
        }
      }
    });
  }

  trackRelated(property: string, entity: object) {
    const related = this.#related.get(property);

    if (!related) {
      this.#related.set(property, [entity]);
    } else {
      related.push(entity);
    }
  }

  isRelated(property: string, entity: object) {
    return this.#related.get(property)?.includes(entity);
  }

  untrackRelated(property: string) {
    this.#related.delete(property);
  }

  setRelated(property: string, entity: object) {
    this.#snapshot.set(property, entity);
  }

  #snap() {
    const entity = this.entity as any;

    this.#snapshot.clear();
    this.model.allProperties.forEach(p => this.#snapshot.set(p.name, entity[p.name]));
  }
}

class Tracker {
  readonly #state = new Map<object, EntityEntry>();
  readonly #identityMap = new IdentityMap();

  constructor(readonly onAdd: (model: EntityModel, entity: object) => Promise<void>) {}

  get entries() {
    return this.#state.values();
  }

  entry(entity: object) {
    return this.#state.get(entity);
  }

  byKey(model: EntityModel, key: EntityKey) {
    return this.#identityMap.get(model, key);
  }

  track(model: EntityModel, key: EntityKey, entity: object, state: EntityState) {
    this.#identityMap.set(model, key, entity);

    const entry = new EntityEntry(entity, model, state, this.#fixup.bind(this));

    this.#state.set(entity, entry);

    this.#fixup(entry);
  }

  updateIdentity(entry: EntityEntry) {
    this.#identityMap.remove(entry.model.name, entry.key);
    this.#identityMap.set(entry.model, entry.model.key!.keyOf(entry.entity)!, entry.entity);
  }

  evict(entry: EntityEntry) {
    this.#state.delete(entry.entity);
    this.#identityMap.remove(entry.model.name, entry.key);
  }

  async detectChanges() {
    for (const entry of this.#state.values()) {
      const entity = entry.entity as any;

      for (const property of entry.model.allProperties) {
        await this.#detectChange(
          entry,
          property,
          entry.snapshot.get(property.name),
          entity[property.name]
        );
      }
    }
  }

  async #detectChange(entry: EntityEntry, property: PropertyModel, original: any, current: any) {
    if (entry.state === "removed") {
      return;
    }

    if (property instanceof NavigationPropertyModel && property.many) {
      await this.#detectArrayChanges(entry, property, current);
    } else if (original !== current) {
      if (property instanceof NavigationPropertyModel) {
        const fk = current ? property.foreignKey.references.key!.keyOf(current) : undefined;

        if (!fk && property.foreignKey.required) {
          entry.setState("removed");
        } else {
          property.foreignKey.set(entry.entity, fk);
        }
      }

      if (entry.state === "unchanged") {
        entry.setState("modified");
      } else {
        this.#fixup(entry);
      }
    }
  }

  async #detectArrayChanges(entry: EntityEntry, property: NavigationPropertyModel, arr: any) {
    if (!Array.isArray(arr)) {
      throw new Error(
        `Property '${property.name}' on entity of type '${entry.model.name}' is not an array.`
      );
    }

    const added = arr.filter(c => !this.#state.has(c));

    for (const entity of added) {
      property.foreignKey.set(entity, entry.key);
      await this.onAdd(property.target, entity);
    }

    Seq(this.#state.values())
      .filter(
        e =>
          e.model === property.target &&
          e.state !== "removed" &&
          is(entry.key, property.foreignKey.value(e.entity)) &&
          !arr.includes(e.entity) &&
          entry.isRelated(property.name, e.entity)
      )
      .forEach(e => {
        e.setState("removed");
        entry.untrackRelated(property.name);
      });
  }

  #fixup(entry: EntityEntry) {
    if (entry.state === "removed") {
      entry.model.dependents.forEach(fk => {
        Seq(this.#state.values())
          .filter(
            e => e.model === fk.parent && e.state !== "removed" && is(entry.key, fk.value(e.entity))
          )
          .forEach(e => e.setState("removed"));
      });
    } else {
      entry.model.navigations.forEach(n => {
        const entity = entry.entity as any;

        if (n.many) {
          const array = entity[n.name] ?? (entity[n.name] = []);

          Seq(this.#state.values())
            .filter(
              e =>
                e.model === n.target &&
                e.state !== "removed" &&
                is(entry.key, n.foreignKey.value(e.entity)) &&
                !array.includes(e.entity)
            )
            .forEach(e => {
              entry.trackRelated(n.name, e.entity);

              array.push(e.entity);
            });
        } else {
          const principal = Seq(this.#state.values()).find(
            e =>
              e.model === n.target &&
              e.state !== "removed" &&
              is(e.key, n.foreignKey.value(entry.entity))
          );

          entity[n.name] = principal?.entity;
        }
      });

      entry.model.foreignKeys.forEach(fk => {
        if (fk.principal) {
          const principal = this.#identityMap.get(fk.references, fk.value(entry.entity)) as any;

          if (principal) {
            const principalEntry = this.#state.get(principal)!;

            if (principalEntry.state !== "removed") {
              if (fk.principal.many) {
                const array = principal[fk.principal.name] ?? (principal[fk.principal.name] = []);

                if (!array.includes(entry.entity)) {
                  principalEntry.trackRelated(fk.principal.name, entry.entity);

                  array.push(entry.entity);
                }
              }
            }
          }
        }
      });

      entry.model.dependents
        .filter(fk => fk.dependent)
        .forEach(fk => {
          Seq(this.#state.values())
            .filter(
              e =>
                e.model === fk.parent && e.state !== "removed" && is(entry.key, fk.value(e.entity))
            )
            .forEach(e => {
              const dependent = e.entity as any;

              dependent[fk.dependent!.name] = entry.entity;
              e.setRelated(fk.dependent!.name, entry.entity);
            });
        });
    }
  }
}

export interface UnitOfWorkApi extends AsyncDisposable {
  /**
   * Adds one or more entities in this unit of work. The entities will be inserted into the database when the
   * unit of work is committed. If the corresponding entity type is configured with a client-side key generator,
   * then keys will be generated and set on the entities; otherwise, the entities will be assigned
   * temporary keys.
   *
   * @param entities One or more entity instances.
   *
   * @returns A promise that resolves once the entities have been added.
   *
   * @example
   *
   * const blog1 = new Blog({
   *  title: 'My first blog',
   *  content: 'This is the content of my first blog',
   * });
   *
   * const blog2 = new Blog({
   *  title: 'My second blog',
   *  content: 'This is the content of my second blog',
   * });
   *
   * await uow.add(blog1, blog2);
   */
  add(...entities: readonly object[]): Promise<void>;

  /**
   * Adds one or more entities in this unit of work. The entities will be inserted into the database when the
   * unit of work is committed. If the corresponding entity type is configured with a client-side key generator,
   * then keys will be generated and set on the entities; otherwise, the entities will be assigned
   * temporary keys.
   *
   * @param entityName The name of the entity model.
   * @param entities One or more entity instances.
   *
   * @returns A promise that resolves once the entities have been added.
   *
   * @example
   *
   * const blog1 = {
   *  title: 'My first blog',
   *  content: 'This is the content of my first blog',
   * };
   *
   * const blog2 = {
   *  title: 'My second blog',
   *  content: 'This is the content of my second blog',
   * }l
   *
   * await uow.add("Blog", blog1, blog2);
   */
  add(entityName: string, ...entities: readonly object[]): Promise<void>;

  /**
   * Removes one or more entities in this unit of work. The entities will be deleted from the database when the
   * unit of work is committed.
   *
   * @param entities The entities to be removed.
   *
   * @example
   * await uow.remove(blog1, blog2);
   */
  remove(...entities: readonly object[]): void;

  /**
   * Commits all changes made in this unit of work to the database.
   * @param isolation Optional isolation level for the database transaction.
   * @return A promise that resolves when the commit is successful.
   */
  commit(isolation?: IsolationLevel): Promise<void>;

  /**
   * Exposes operations that can be performed on an entity in this unit of work.
   *
   * @param entity The entity for which the entry API needs to be retrieved.
   * @returns The entry API for the entity, or undefined if not found.
   *
   * @example
   * uow.entry(album).setState('removed');
   */
  entry<Entity extends object>(entity: Entity): EntityEntryApi<Entity> | undefined;
}

type Operation = {
  sql: SqlNode;
  args?: unknown[];
  onCommit?: ((result: ExecuteResult) => void) | undefined;
} & ExecuteStatement;

const generators = new Map<ScalarPropertyModel, IdGenerator<unknown>>();

/**
 * @ignore
 */
export class UnitOfWorkImpl {
  readonly #metadata: Metadata;
  readonly #tracker = new Tracker((m, e) => this.#addCore(m, e));

  constructor(metadata: Metadata) {
    this.#metadata = metadata;
  }

  entry<Entity extends object>(entity: Entity) {
    notNull({ entity });

    return this.#tracker.entry(entity);
  }

  add(...entities: readonly object[]): Promise<void>;
  add(entityName: string, ...entities: readonly object[]): Promise<void>;
  async add(...maybeNameAndEntities: readonly any[]) {
    notNull({ maybeNameAndEntities });

    let entityName = Object.name;
    let start = 0;

    if (typeof maybeNameAndEntities[0] === "string") {
      entityName = maybeNameAndEntities[0];
      start = 1;
    }

    for (let i = start; i < maybeNameAndEntities.length; i++) {
      const entity = maybeNameAndEntities[i]!;

      entityName = entity.constructor === Object ? entityName : entity.constructor.name;

      if (entityName === Object.name) {
        throw new Error(
          `Unable to determine an entity type for object: '${JSON.stringify(entity)}'.`
        );
      }

      const entry = this.entry(entity);

      if (entry) {
        error(
          `Entity of type '${entry.model.name}' already tracked in this
           unit of work with state '${entry.state}'.`
        );
      }

      const model = this.#metadata.model.entity(entityName);

      await this.#addCore(model, entity);
    }
  }

  async #addCore(model: EntityModel, entity: any) {
    this.#setDefaults(model, entity);

    const keyModel = model.key!;
    let key = keyModel.keyOf(entity);

    if (!key || key.some(v => this.#isTempValue(v))) {
      key = await this.#ensureKey(keyModel, entity);
    }

    this.set(model, key, entity, "added");
  }

  #setDefaults(model: EntityModel, entity: any) {
    this.#metadata.inheritance.updatableProperties(model).forEach(p => {
      if (p.scalar.generate?.default !== undefined) {
        let current = entity;

        p.path.forEach(p => {
          if (!current[p.name]) {
            current[p.name] = new p.target.klass();
          }
          return (current = current[p.name]);
        });

        if (current[p.scalar.name] === undefined) {
          current[p.scalar.name] =
            typeof p.scalar.generate.default === "function"
              ? p.scalar.generate.default(current)
              : p.scalar.generate.default;
        }
      }
    });
  }

  async #ensureKey(keyModel: KeyModel, entity: any) {
    const values = [];

    for (const property of keyModel.properties) {
      let generator = generators.get(property);
      const generate = property.generate;

      if (!generator && generate) {
        switch (generate.using) {
          case "seqhilo":
            const sequence = this.#metadata.model.sequence(generate.sequence!);

            generator = new SeqHilo(
              this.#metadata.config.driver,
              sequence.name,
              sequence.increment
            );

            generators.set(property, generator);

            break;

          case "identity":
            generator = Identity.INSTANCE;

            generators.set(property, generator);

            break;

          case "uuid":
            generator = Uuid.INSTANCE;

            generators.set(property, generator);

            break;

          default:
            throw new Error(`Unknown or unsupported key generator: '${generate.using}'.`);
        }
      }

      if (generator) {
        const value = await generator.next();

        entity[property.name] = value;

        values.push(value);
      } else {
        const value = entity[property.name];

        if (value) {
          values.push(value);
        }
      }
    }

    const key = List(values);

    if (key.size != keyModel.properties.size) {
      throw new Error(
        "No key available for entity. Ensure that a key is set or that a key generator is configured."
      );
    }

    return key;
  }

  remove(...entities: readonly object[]) {
    notNull({ entities });

    entities.forEach(e => {
      const entry = this.entry(e);

      if (!entry) {
        throw new Error(`Entity '${JSON.stringify(e)}' is not tracked in this unit of work.`);
      }

      entry.setState("removed");
    });
  }

  get(model: EntityModel, key: EntityKey) {
    notNull({ model, key });

    return this.#tracker.byKey(model, key);
  }

  set(model: EntityModel, key: EntityKey, entity: object, state: EntityState = "unchanged") {
    notNull({ model, key, entity, state });

    this.#tracker.track(model, key, entity, state);
  }

  async commit(isolation?: IsolationLevel) {
    const start = performance.now();

    await this.#tracker.detectChanges();

    const inserts = OrderedMap(this.#metadata.model.entities.map(e => [e, [] as Operation[]]));
    const updates = OrderedMap(this.#metadata.model.entities.map(e => [e, [] as Operation[]]));
    const deletes = OrderedMap(
      this.#metadata.model.entities.reverse().map(e => [e, [] as Operation[]])
    );

    for (const entry of this.#tracker.entries) {
      switch (entry.state) {
        case "added":
          inserts.get(entry.model)!.push(this.#insert(entry));
          break;

        case "modified":
          updates.get(entry.model)!.push(this.#update(entry));
          break;

        case "removed":
          deletes.get(entry.model)!.push(this.#delete(entry));
          break;
      }
    }

    const operations: Operation[] = [];

    inserts
      .valueSeq()
      .concat(updates.valueSeq())
      .concat(deletes.valueSeq())
      .forEach(ops => operations.push(...ops));

    await this.executeBatch(operations, start, isolation);
  }

  protected async executeBatch(
    batch: readonly Operation[],
    start: number,
    isolation?: IsolationLevel
  ) {
    if (batch.length > 0) {
      await this.#metadata.config.driver.execute(
        batch,
        isolation ?? this.#metadata.config.isolation,
        results => {
          batch.forEach((o, i) => o.onCommit?.(results[i++]!));

          this.#metadata.config.logger?.info(
            `Commit executed in: ${(performance.now() - start).toFixed(2)}ms`
          );
        }
      );
    } else {
      this.#metadata.config.logger?.warn("Warning: No operations to commit.");
    }
  }

  #isTempValue(value: any) {
    return value === null || value === undefined || value === "" || value <= 0;
  }

  #principalValues: Map<ScalarPropertyModel, Map<unknown, unknown>> = new Map();

  #insert(entry: EntityEntry) {
    const args: unknown[] = [];
    const dependents: [ScalarPropertyModel, number, unknown][] = [];

    const [inserting, returning] = this.#metadata.inheritance
      .updatableProperties(entry.model)
      .reduce(
        (acc, path) => {
          const inserting = acc[0];
          const returning = acc[1];
          const property = path.scalar;
          const value = this.#getValue(path, entry.entity);
          const temp = this.#isTempValue(value);

          if (property.storeGenerated && temp) {
            return [inserting, returning.push([property, value])];
          } else {
            if (temp && property.principal) {
              dependents.push([property, inserting.size, value]);
            }

            return [inserting.push([property, value]), returning];
          }
        },
        [List<[ScalarPropertyModel, unknown]>(), List<[ScalarPropertyModel, unknown]>()]
      );

    let onBeforeExecute: ((args: unknown[]) => void) | undefined;

    if (dependents.length > 0) {
      dependents.forEach(([p, _, v]) => {
        if (!this.#principalValues.has(p.principal!)) {
          this.#principalValues.set(p.principal!, new Map([[v, undefined]]));
        } else {
          this.#principalValues.get(p.principal!)!.set(v, undefined);
        }
      });

      onBeforeExecute = args =>
        dependents.forEach(
          ([p, i, v]) => (args[i] = this.#principalValues.get(p.principal!)?.get(v) ?? null)
        );
    }

    let onAfterExecute: ((result: ExecuteResult) => void) | undefined;
    let onCommit: ((result: ExecuteResult) => void) | undefined;

    if (!returning.isEmpty()) {
      onAfterExecute = result => {
        returning.forEach(([p, v], i) => {
          if (this.#principalValues.has(p)) {
            this.#principalValues.get(p)!.set(v, result.returning[i]);
          }
        });
      };

      onCommit = r => {
        returning.forEach(([p, _], i) => entry.update({ [p.name]: r.returning[i] }));

        dependents.forEach(([p, _, v]) =>
          entry.update({ [p.name]: this.#principalValues.get(p.principal!)?.get(v) })
        );

        this.#tracker.updateIdentity(entry);
      };
    }

    return {
      sql: new SqlInsert(
        sqlId(entry.model.table!),
        inserting.map(([p, _]) => sqlId(p.column!)),
        inserting.map(([_, v]) => this.createParameter(v, args)),
        returning.map(([p, _]) => sqlId(p.column!)),
        new SqlBinding({ model: entry.model.key })
      ),
      args,
      onBeforeExecute,
      onAfterExecute,
      onCommit: r => {
        onCommit?.(r);
        entry.commit();
      },
    } as Operation;
  }

  #update(entry: EntityEntry) {
    const args: unknown[] = [];
    const updating = entry.model
      .scalarFlatMap()
      .filter(p => !p.scalar.storeGenerated && !entry.model.key!.properties.includes(p.scalar));

    let onCommit: ((result: ExecuteResult) => void) | undefined;

    return {
      sql: new SqlUpdate(
        sqlId(entry.model.table!),
        updating.map(p => {
          const column = sqlId(p.scalar.column!);
          const value = this.#getValue(p, entry.entity);

          let rhs: SqlNode;

          if (entry.model.concurrency?.version === p.scalar) {
            rhs = this.createParameter(value + 1, args);
            onCommit = _ => {
              entry.update({ [p.scalar.name]: value + 1 });
            };
          } else {
            rhs = this.createParameter(value, args);
          }

          return sqlBin(column, "=", rhs);
        }),
        this.#where(entry, args)
      ),
      args,
      onAfterExecute: r => this.#checkConcurrency(r),
      onCommit: r => {
        onCommit?.(r);
        entry.commit();
      },
    } as Operation;
  }

  #delete(entry: EntityEntry) {
    const args: unknown[] = [];

    return {
      sql: new SqlDelete(sqlId(entry.model.table!), this.#where(entry, args)),
      args,
      onAfterExecute: r => this.#checkConcurrency(r),
      onCommit: _ => this.#tracker.evict(entry),
    } as Operation;
  }

  #checkConcurrency(r: ExecuteResult) {
    if (r.rowsAffected !== 1) {
      throw new ConcurrencyError();
    }
  }

  #where(entry: EntityEntry, args: unknown[]) {
    let where = entry.model
      .key!.properties.map(p => {
        return sqlBin(
          sqlId(p.column!),
          "=",
          this.createParameter(this.#getValue({ path: List(), scalar: p }, entry.entity), args)
        );
      })
      .reduce((acc: SqlNode, next) => (acc ? sqlBin(acc, "and", next) : next));

    const version = entry.model.concurrency?.version;

    if (version) {
      where = sqlBin(
        where,
        "and",
        sqlBin(
          sqlId(version.column!),
          "=",
          this.createParameter(
            this.#getValue({ path: List(), scalar: version }, entry.entity),
            args
          )
        )
      );
    }

    return where;
  }

  protected createParameter(value: unknown, args: unknown[]): SqlNode {
    return new SqlParameter(args.push(value) - 1);
  }

  #getValue(path: ScalarPropertyPath, entity: any) {
    let value = entity;

    for (const p of path.path) {
      value = value?.[p.name];
    }

    value = value?.[path.scalar.name];
    value = path.scalar.convert?.write?.(value) ?? value;

    if (value === undefined) {
      value = null;
    }

    return value;
  }

  async [Symbol.asyncDispose]() {}
}

/**
 * @ignore
 */
export class UnitOfWorkSpy extends UnitOfWorkImpl {
  readonly #operations: Operation[] = [];

  constructor(metadata: Metadata) {
    super(metadata);
  }

  get operations() {
    return this.#operations;
  }

  protected override async executeBatch(
    batch: readonly Operation[],
    _: number,
    __?: IsolationLevel
  ) {
    this.#operations.push(...batch);
  }
}

/**
 * Thrown when an optimistic concurrency violation is detected. This occurs when an entity is updated or deleted
 * and the expected number of rows affected is not met.
 */
export class ConcurrencyError extends Error {
  constructor() {
    super(
      "Concurrency Error - 0 rows affected. Either the row has been deleted, or a concurrency violation was detected."
    );
  }
}
