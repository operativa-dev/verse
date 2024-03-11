/**
 * The top-level Verse object and related types.
 *
 * @packageDocumentation
 */

import { List } from "immutable";
import { Convention } from "./conventions/convention.js";
import {
  ColumnFromPascalCasedPropertyName,
  ColumnTypeFromProperties,
  ForeignKeyFromEntityNameAndPrimaryKeyName,
  ForeignKeyFromNavigation,
  ForeignKeyFromPrimaryKeyName,
  ForeignKeyOnDelete,
  MaxLengthDefault,
  NavigationForeignKeyFromDependent,
  PrecisionScaleDefaults,
  PrimaryKeyFromProperty,
  PropertiesAreNotNullable,
  TableFromEntityName,
  TablePerHierarchy,
  VersionProperty,
} from "./conventions/database.js";
import { EntityNameFromLabel } from "./conventions/model.js";
import { Driver, IsolationLevel } from "./db/driver.js";
import { SchemaGenerator } from "./db/schema.js";
import { SingleTableInheritance } from "./inheritance/sti.js";
import { InheritanceStrategy } from "./inheritance/strategy.js";
import { ModelBinder } from "./model/binder.js";
import { UnwrapProperties } from "./model/builder.js";
import { EntityModel, Model, ValueObjectModel } from "./model/model.js";
import { ModelValidator } from "./model/validator.js";
import { QueryCompiler } from "./query/compiler.js";
import {
  AbstractQueryable,
  AsyncQueryable,
  AsyncQueryableRoot,
  AsyncSequence,
  Queryable,
  QueryableRoot,
} from "./query/queryable.js";
import { EntityState, UnitOfWorkApi, UnitOfWorkImpl, UnitOfWorkSpy } from "./uow.js";
import { notNull } from "./utils/check.js";
import { Logger } from "./utils/logging.js";

/**
 * An object specifying runtime configuration information like the database driver,
 * logger, and default transaction isolation level.
 *
 * @example
 * const config = {
 *   driver: new PostgresDriver(),
 *   logger: new ConsoleLogger(),
 * }
 *
 * const db = verse({
 *   config,
 *   {
 *     // model definition...
 *   }
 * });
 */
export type Config = {
  /**
   * The database driver.
   */
  readonly driver: Driver;

  /**
   * A logger instance.
   */
  readonly logger: Logger;

  /**
   * The default transaction isolation level.
   */
  readonly isolation?: IsolationLevel | undefined;
};

/**
 * A metadata object containing the configuration, model, and inheritance strategy.
 */
export type Metadata = {
  /**
   * The runtime configuration.
   */
  config: Config;

  /**
   * The metadata model.
   */
  model: Model;

  /**
   * The inheritance strategy.
   */
  inheritance: InheritanceStrategy;
};

/**
 * A type that can infer an entity type from an {@link EntityModel} when used in conjunction with
 * the _typeof_ operator.
 *
 * @example
 * const db = verse({
 *   config: // ...
 *   model: {
 *     entities: {
 *       customers: entity(
 *         // ...
 *       )
 *     },
 *   },
 * });
 *
 * type Customer = EntityType<typeof db.entities.customers>;
 */
export type EntityType<Model extends EntityModel> =
  Model extends EntityModel<infer Properties> ? UnwrapProperties<Properties> : never;

/**
 * Settings that affect the behaviour of individual queries, such as disabling default entity
 * query conditions. Used in conjunction with the {@link RootQueryOperations.options} query operator.
 */
export type QueryOptions = {
  /**
   * Disables entity query conditions for the query.
   *
   * @example
   * // Disable the default "soft delete" condition for the query.
   * const q =
   *   db.from.products.options({ disabledConditions: ["soft delete"] });
   */
  disabledConditions?: "all" | string[];
};

/**
 * Compiled query operators.
 *
 * See {@link Queryable} for a list of available query operators.
 */
export type From<TEntities extends { [Key in keyof TEntities]: EntityModel } = any> = {
  [Key in keyof TEntities]: Queryable<EntityType<TEntities[Key]>> &
    RootQueryOperations<Queryable<EntityType<TEntities[Key]>>>;
};

/**
 * Non-compiled query operators.
 *
 * See {@link AsyncQueryable} for a list of available query operators.
 */
export type AsyncFrom<TEntities extends { [Key in keyof TEntities]: EntityModel }> = {
  [Key in keyof TEntities]: AsyncQueryable<EntityType<TEntities[Key]>> &
    RootQueryOperations<AsyncQueryable<EntityType<TEntities[Key]>>>;
};

export type RootQueryOperations<TQueryable extends AbstractQueryable> = {
  /**
   * Inject a raw SQL query using tagged template literals. The returned queryable may be further
   * composed with additional query operators.
   *
   * @example
   * const id = 1;
   * const album =
   *   db.from.albums
   *     .sql`select * from "Album" where "AlbumId" = ${id}`.single();
   *
   * @param strings The SQL query template string.
   * @param values The values to be inserted into the query.
   * @returns The queryable result of the injected SQL query.
   */
  sql(strings: TemplateStringsArray, ...values: any[]): TQueryable;

  /**
   * Set query options that affect the behaviour of the query.
   *
   * @example
   * const q =
   *   db.from.albums.options({ disabledConditions: ["soft delete"] });
   *
   * @param options The query options.
   * @returns The queryable with the specified options applied.
   */
  options(options: QueryOptions): TQueryable;
};

/**
 * Strongly-typed entity unit of work add/remove functions.
 */
export type EntitySet<T extends object> = {
  /**
   * Adds one or more entities to the current unit of work. The entities will be tracked in the
   * `added` {@link EntityState} and will be inserted into the database when the unit of work is
   * committed.
   *
   * @param entities The entities to be added to the unit of work.
   * @returns A promise that resolves when the entities have been successfully
   * added to the unit of work.
   */
  add(
    ...entities: (T extends { __proto: "class" } ? Omit<T, "__proto"> : Partial<T>)[]
  ): Promise<void>;

  /**
   * Removes one or more entities from the current unit of work. The entities will be tracked in the
   * `removed` {@link EntityState} and will be deleted from the database when the unit of work is
   * committed.
   *
   * @param entities The entities to be removed from the unit of work.
   */
  remove(...entities: Omit<T, "__proto">[]): void;
};

/**
 * Extracts the object type from an {@link EntityModel}.
 */
export type EntityObject<Model extends EntityModel> =
  Model extends EntityModel<infer _, infer Object> ? Object : never;

/**
 * Labelled access to strongly-typed entity query and unit of work operations.
 */
export type EntitySets<TEntities extends { [Key in keyof TEntities]: EntityModel }> = {
  [Key in keyof TEntities]: AsyncQueryable<EntityType<TEntities[Key]>> &
    EntitySet<EntityObject<TEntities[Key]>> &
    RootQueryOperations<AsyncQueryable<EntityType<TEntities[Key]>>>;
};

/**
 * The full unit of work API.
 */
export type UnitOfWork<TEntities extends { [Key in keyof TEntities]: EntityModel }> =
  UnitOfWorkApi & EntitySets<TEntities>;

/**
 * The result of a query execution.
 */
export type QueryResult<T> = T extends Queryable<infer R> ? AsyncSequence<R> : Promise<T>;

/**
 * An object containing labelled {@link EntityModel} configuration objects.
 */
export type Entities = { [K: string]: EntityModel };

/**
 * An object containing entity and value-object configuration.
 */
export type ModelBuilder<TEntities extends Entities> = {
  /**
   * One or more labelled entity models.
   */
  entities: TEntities;

  /**
   * Zero or more value objects models.
   */
  values?: ValueObjectModel[];
};

/**
 * The top-level Verse object.
 *
 * See {@link verse} for detailed usage information.
 */
export class Verse<TEntities extends Entities = any> {
  readonly #conventions: List<Convention>;

  /**
   * Provides methods to perform various operations on the database.
   */
  readonly database: DbOperations;

  /**
   * Provides access to strongly-typed entity query operations.
   */
  readonly from: AsyncFrom<TEntities>;

  /**
   * The metadata object containing the configuration, model, and inheritance strategy.
   */
  readonly metadata: Metadata;

  readonly #compiler: QueryCompiler;
  readonly #uow: () => UnitOfWork<TEntities>;

  readonly #inheritance = new SingleTableInheritance();

  /**
   * The labelled entity models. Enables easy use of {@link EntityType} with `typeof`
   * from the root verse instance.
   */
  readonly entities!: TEntities;

  /**
   * Creates a new instance.
   *
   * @param config The configuration object.
   * @param builder The model builder object.
   */
  constructor(
    readonly config: Config,
    builder: ModelBuilder<TEntities>
  ) {
    notNull({ config, model: builder });

    config.driver.logger = config.logger;

    this.#conventions = List.of(
      new EntityNameFromLabel(),
      new ColumnFromPascalCasedPropertyName(),
      new TableFromEntityName(),
      new TablePerHierarchy(),
      new PrimaryKeyFromProperty(),
      new ForeignKeyFromNavigation(),
      new ForeignKeyFromPrimaryKeyName(),
      new ForeignKeyFromEntityNameAndPrimaryKeyName(),
      new ColumnTypeFromProperties(),
      new PropertiesAreNotNullable(),
      new ForeignKeyOnDelete(),
      new NavigationForeignKeyFromDependent(),
      new MaxLengthDefault(),
      new PrecisionScaleDefaults(),
      new VersionProperty(),
      ...(this.config.driver.conventions ?? [])
    );

    const entities = builder.entities;

    Object.entries(entities).forEach(([k, v]) => {
      const key = k as keyof TEntities;
      const entityModel = v as TEntities[typeof key];
      entities[key] = entityModel.withLabel(k) as TEntities[typeof key];
    });

    const model = this.#bind(
      this.#applyConventions(new Model(List(Object.values(entities)), List(builder.values ?? [])))
    );

    model.accept(new ModelValidator(this.#inheritance));

    this.metadata = {
      config: this.config,
      model: model,
      inheritance: this.#inheritance,
    };

    this.database = new DbOperations(this.metadata);

    this.from = this.#labelled<AsyncFrom<TEntities>>(
      entities,
      label => () =>
        new AsyncQueryableRoot(
          model.entityByLabel(label).name,
          this.#compiler
        ) as AsyncFrom<TEntities>[typeof label]
    );

    this.#compiler = new QueryCompiler(
      this.metadata,
      this.#labelled<From<TEntities>>(
        entities,
        label => () =>
          new QueryableRoot(model.entityByLabel(label).name) as From<TEntities>[typeof label]
      )
    );

    this.#uow = () => {
      const uow = new UnitOfWorkImpl(this.metadata);

      return this.#labelled(
        entities,
        label => () =>
          new QueryableSet(
            model.entityByLabel(label).name,
            this.#compiler,
            uow
          ) as EntitySets<TEntities>[typeof label],
        uow as UnitOfWork<TEntities>
      );
    };
  }

  /**
   * Compiles a query and returns a function that can be invoked to execute the query.
   *
   * Compiled queries are useful when you need to execute the same query multiple times with different
   * parameters, or when you want to cache the query for reuse. Compiled query execution is faster than
   * non-compiled query execution because the query is only compiled once.
   *
   * @param query The query function to compile.
   * @return The compiled query function that can be invoked with the specified arguments.
   *
   * @example
   * const query = db.compile(
   *   (from, $id: number) => from.albums.where(a => a.albumId === $id).single());
   *
   * const album = query(42);
   */
  compile<R, A extends unknown[]>(query: (from: From<TEntities>, ...args: A) => R) {
    notNull({ query });

    const compiled = this.#compiler.compile(query, false);

    return ((...args: A) => compiled((args as A[]) ?? [])) as (...args: A) => QueryResult<R>;
  }

  /**
   * Compiles a query and returns a function that can be invoked to execute the query within a unit of work.
   * Entity changes made within the unit of work will be tracked and persisted to the database when the
   * unit of work is committed.
   *
   * Compiled queries are useful when you need to execute the same query multiple times with different
   * parameters, or when you want to cache the query for reuse. Compiled query execution is faster than
   * non-compiled query execution because the query is only compiled once.
   *
   * @param query The query function to compile.
   * @return The compiled query function that can be invoked with the specified arguments.
   *
   * @example
   * const query = db.compileUow(
   *   (from, $id: number) => from.albums.where(a => a.albumId === $id).single());
   *
   * const uow = db.uow();
   * const album = query(uow, 42);
   */
  compileUow<R, A extends unknown[]>(query: (from: From<TEntities>, ...args: A) => R) {
    notNull({ query });

    const compiled = this.#compiler.compile(query, false);

    return ((uow: UnitOfWorkImpl, ...args: A) => compiled((args as A[]) ?? [], uow)) as (
      uow: UnitOfWork<TEntities>,
      ...args: A
    ) => QueryResult<R>;
  }

  /**
   * Creates a new unit of work, an object that tracks changes to entities and
   * can be used to persist them to the database.
   *
   * @returns A new unit of work.
   *
   * @example
   * const uow = db.uow();
   * const customer =
   *   await uow.customers
   *     .where(c => c.name === "Customer 1")
   *     .single();
   *
   * customer.name = "Customer 1 Updated!";
   *
   * await uow.commit();
   */
  uow() {
    return this.#uow();
  }

  #bind(model: Model) {
    return new ModelBinder().bind(model);
  }

  #labelled<T>(entities: TEntities, value: (label: string) => unknown, target?: T) {
    return Object.keys(entities).reduce(
      (from, key) => {
        Object.defineProperty(from, key, {
          get: value(key) as any,
        });

        return from;
      },
      target ?? ({} as T)
    );
  }

  #applyConventions(model: Model) {
    let prevModel: Model;
    let counter = 0;

    while (counter < 5) {
      prevModel = model;
      model = this.#conventions.reduce((m, c) => c.apply(m), model);
      if (prevModel === model) {
        break;
      }
      counter++;
    }

    if (counter === 5) {
      throw new Error(
        "Maximum iteration limit exceeded when applying conventions! Redundant new instance?"
      );
    }

    return model;
  }
}

/**
 * Creates a new top-level Verse instance, which is the API entry point for data access operations.
 *
 * Initialize the Verse instance with {@link Config} and {@link ModelBuilder} objects.
 *
 * Query and update operations are accessed through the {@link Verse.from} property and {@link Verse.uow}
 * function, respectively.
 *
 * @param setup The config and model initialization for this Verse instance.
 * @param setup.config The config object.
 * @param setup.model The model initialization object.
 * @return The new instance of Verse.
 *
 * @includeExample ../../apps/snippets/src/basic.ts
 */
export function verse<TEntities extends Entities>(setup: {
  config: Config;
  model: ModelBuilder<TEntities>;
}) {
  return new Verse(setup.config, setup.model);
}

/**
 * Contains methods to perform various operations on the current database.
 */
export class DbOperations {
  readonly #metadata: Metadata;

  /**
   * Creates a new instance.
   *
   * @param metadata The Verse metadata object.
   */
  constructor(metadata: Metadata) {
    this.#metadata = metadata;
  }

  /**
   * Determine whether the target database exists.
   * @returns A promise that resolves to `true` if the database exists, otherwise `false`.
   */
  async exists() {
    return this.#metadata.config.driver.exists();
  }

  /**
   * Get a list of SQL operations that could be executed to create the database schema.
   * @returns A list of SQL operations.
   */
  schema() {
    return List(new SchemaGenerator().generate(this.#metadata));
  }

  /**
   * Re-create the database schema, and, optionally, seed the database with any seed data defined in the model.
   *
   * NB: This will drop the target database if it exists.
   *
   * @param seed Whether to seed the database with any seed data defined in the model.
   * @returns A promise that resolves when the schema has been created.
   */
  async recreate(seed = true) {
    const driver = this.#metadata.config.driver;

    await driver.drop();
    await driver.create();

    const ddl = this.schema()
      .map(sql => ({ sql }))
      .toArray();

    await driver.execute(ddl);

    if (seed) {
      const uow = new UnitOfWorkSpy(this.#metadata);

      for (const entity of this.#metadata.model.entities) {
        if (entity.data) {
          await uow.add(entity.name, ...entity.data);
        }
      }

      await uow.commit();

      if (uow.operations.length > 0) {
        await driver.execute(uow.operations);
      }
    }
  }
}

class QueryableSet<T extends object> extends AsyncQueryableRoot<T> implements EntitySet<T> {
  readonly #entity: string;

  constructor(
    entity: string,
    compiler: QueryCompiler,
    private readonly uow: UnitOfWorkImpl
  ) {
    super(entity, compiler);

    this.#entity = entity;
  }

  async add(...entities: Partial<T>[]) {
    await this.uow.add(this.#entity, ...entities);
  }

  remove(...entities: T[]) {
    this.uow.remove(...entities);
  }

  protected override execute() {
    return super.execute(this.uow);
  }
}
