/**
 * Fluent API for building the entity metadata model.
 *
 * @packageDocumentation
 */

import { List } from "immutable";
import { Newable, NonEmptyObject } from "ts-essentials";
import { SqlType } from "../db/sql.js";
import { notEmpty, notNull } from "../utils/check.js";
import { array, Brand } from "../utils/utils.js";
import { EntityType } from "../verse.js";
import {
  BooleanPropertyModel,
  ConcurrencyModel,
  Condition,
  ConversionModel,
  DatePropertyModel,
  EntityModel,
  ForeignKeyModel,
  GeneratorModel,
  IntPropertyModel,
  KeyModel,
  NavigationPropertyModel,
  NumberPropertyModel,
  OnDelete,
  PropertyModel,
  ScalarPropertyModel,
  StringPropertyModel,
  ValueObjectModel,
  ValueObjectPropertyModel,
} from "./model.js";

/**
 * A property model factory function.
 * @param name The name of the property.
 * @returns The property model object.
 */
// @ts-ignore
export type Property<T> = (name: string) => PropertyModel;

/**
 * A set of entity property configurations.
 *
 * @template T An entity type.
 */
export type Properties<T> = { [K in keyof T]?: Property<T[K]> } & { [key: string]: Property<any> };

/**
 * The set of optional properties in an entity configuration.
 */
export type OptionalProperties<T> = {
  [K in keyof T]: T[K] extends Property<infer R> ? (R extends undefined ? K : never) : never;
}[keyof T];

/**
 * A utility type for unwrapping the properties of entity builder properties.
 *
 * @template T - The type to unwrap the properties from.
 */
export type UnwrapProperties<T> = {
  [K in OptionalProperties<T>]?: T[K] extends Property<infer R>
    ? R extends { [key: string]: unknown }
      ? UnwrapProperties<R>
      : R
    : T[K];
} & {
  [K in Exclude<keyof T, OptionalProperties<T>>]: T[K] extends Property<infer R>
    ? R extends { [key: string]: unknown }
      ? UnwrapProperties<R>
      : R
    : T[K];
};

/**
 * The numeric keys of an object.
 */
export type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

export type FromClass<T> = Brand<T, "class">;

/**
 * Builds an {@link EntityModel} based on a Class.
 * @template C - The class type.
 *
 * @param klass The class of the entity.
 * @param properties The properties of the entity.
 * @param build An optional builder function.
 * @returns The created entity model.
 *
 * @includeExample ../../apps/snippets/src/building.ts:1-33
 */
export function entity<C extends object, P extends Properties<C>>(
  klass: Newable<C>,
  properties: NonEmptyObject<P>,
  build?: (builder: EntityBuilder<P, C>) => void
): EntityModel<P, FromClass<C>>;

/**
 * Builds an {@link EntityModel} based on an Object. The type of the entity can be inferred using
 * the {@link EntityType} utility type.
 *
 * @param properties The properties of the entity.
 * @param build An optional builder function.
 * @returns The created entity model.
 *
 * @includeExample ../../apps/snippets/src/building.ts:35-50
 */
export function entity<O extends object, P extends Properties<O>>(
  properties: NonEmptyObject<P>,
  build?: (builder: EntityBuilder<P, UnwrapProperties<P>>) => void
): EntityModel<P, UnwrapProperties<P>>;

export function entity<T extends object, P extends Properties<T>>(
  klassOrProperties: Newable<T> | P,
  propertiesOrBuild?: P | ((builder: EntityBuilder<P>) => void),
  build?: (builder: EntityBuilder<P>) => void
) {
  let klass: Newable<unknown>;
  let properties: P | undefined;

  if (typeof klassOrProperties === "function") {
    klass = klassOrProperties;
  } else {
    klass = Object as Newable<unknown>;
    properties = klassOrProperties;
  }

  if (typeof propertiesOrBuild === "function") {
    build = propertiesOrBuild;
  } else if (!properties) {
    properties = propertiesOrBuild;
  }

  const builder = new EntityBuilderImpl<P>();

  builder.properties(properties as P);

  if (typeof build === "function") {
    build(builder);
  }

  return builder.build(klass);
}

/**
 * Builds a {@link ValueObjectModel} based on a Class.
 * @template C - The class type.
 *
 * @param klass The class of the value object.
 * @param properties The properties of the value object.
 * @returns The created value object model.
 */
export function valueObject<C extends object, P extends Properties<C>>(
  klass: Newable<C>,
  properties: NonEmptyObject<P>
): ValueObjectModel;

/**
 * Builds a {@link ValueObjectModel} based on an Object.
 *
 * @param name The name of the value object.
 * @param properties The properties of the entity.
 * @returns The created value object model.
 */
export function valueObject<O extends object, P extends Properties<O>>(
  name: string,
  properties: NonEmptyObject<P>
): ValueObjectModel;

export function valueObject<T extends object, P extends Properties<T>>(
  klassOrName: Newable<T> | string,
  properties: P
) {
  let klass: Newable<unknown>;
  let name: string;

  if (typeof klassOrName === "function") {
    klass = klassOrName;
    name = klass.name;
  } else {
    klass = Object as Newable<unknown>;
    name = klassOrName;
  }

  const builder = new ValueObjectBuilderImpl<P>(name);

  builder.properties(properties as P);

  return builder.build(klass);
}

/**
 * Represents the options for a foreign key constraint.
 *
 * @property onDelete The action to be performed when the referenced entity is deleted.
 */
export type ForeignKeyOptions = {
  onDelete?: OnDelete;
};

/**
 * Fluent API for configuring an entity metadata model.
 * @template T - The entity builder type.
 * @template O - The entity instance type.
 */
export interface EntityBuilder<T extends object, O extends object = any> {
  /**
   * Configures the key of the entity.
   *
   * @param key One or more properties to use as the key.
   * @return A chainable EntityBuilder instance.
   */
  key(...key: readonly (keyof T)[]): EntityBuilder<T>;

  /**
   * Configures a foreign key reference to another entity.
   *
   * @template R The type of the referenced entity.
   * @param entityClassOrName The referenced entity class or name.
   * @param properties The referencing properties in the current entity.
   * @param options Options controlling the behavior of the foreign key.
   * @returns A chainable EntityBuilder instance.
   */
  references<R extends object>(
    entityClassOrName: Newable<R> | string,
    properties?: keyof T | readonly (keyof T)[],
    options?: ForeignKeyOptions
  ): EntityBuilder<T>;

  /**
   * Configures a foreign key reference to another entity.
   *
   * @template R The type of the referenced entity.
   * @param entityClassOrName The referenced entity class or name.
   * @param options Options controlling the behavior of the foreign key.
   * @returns A chainable EntityBuilder instance.
   */
  references<R extends object>(
    entityClassOrName: Newable<R> | string,
    options?: ForeignKeyOptions
  ): EntityBuilder<T>;

  references<R extends object>(
    entityClassOrName: Newable<R> | string,
    propertiesOrOptions?: (keyof T | readonly (keyof T)[]) | ForeignKeyOptions,
    options?: ForeignKeyOptions
  ): EntityBuilder<T>;

  /**
   * Configures the table name of the entity.
   *
   * @param name The table name.
   * @returns A chainable EntityBuilder instance.
   */
  table(name: string): EntityBuilder<T>;

  /**
   * Configures a condition for the entity. Conditions are predicates that are applied by
   * default to all queries for the entity.
   *
   * @param condition The condition function.
   * @param name The name of the condition.
   * @returns A chainable EntityBuilder instance.
   */
  condition(condition: (entity: UnwrapProperties<T>) => boolean, name?: string): EntityBuilder<T>;

  /**
   * Configures the concurrency control property of the entity.
   *
   * @param concurrency The version property of the entity.
   * @returns A chainable EntityBuilder instance.
   */
  concurrency(concurrency: { version: NumberKeys<UnwrapProperties<T>> }): EntityBuilder<T>;

  /**
   * Configures the initial seed data for the entity.
   *
   * @param data The initial data.
   * @returns A chainable EntityBuilder instance.
   */
  data(...data: readonly Partial<O>[]): EntityBuilder<T>;
}

/**
 * @ignore
 */
export const ObjectNamePrefix = "Object_";

let objectNameCount = 0;

/**
 * @ignore
 */
export class EntityBuilderImpl<T extends object, O extends object = any>
  implements EntityBuilder<T>
{
  #properties?: List<PropertyModel> | undefined;
  #key?: readonly (keyof T)[] | undefined;
  #table?: string;
  #foreignKeys: List<{
    entity: string;
    properties?: readonly (keyof T)[] | undefined;
    onDelete?: OnDelete | undefined;
  }> = List();
  #conditions: List<Condition> = List();
  #concurrency?: { version: NumberKeys<UnwrapProperties<T>> } | undefined;
  #data?: List<Partial<O>> | undefined;

  properties(properties: Properties<T>) {
    if (this.#properties) {
      throw new Error("'properties' should only be called once.");
    }

    this.#properties = List<PropertyModel>().withMutations(l =>
      Object.entries(properties).forEach(([k, v]) => {
        const factory = v as (k: string) => PropertyModel;
        l.push(factory(k));
      })
    );
  }

  key(...key: readonly (keyof T)[]) {
    notEmpty({ key });

    this.#key = array(key);

    return this;
  }

  references<R extends object>(
    entityClassOrName: Newable<R> | string,
    propertiesOrOptions?: (keyof T | readonly (keyof T)[]) | ForeignKeyOptions,
    options?: ForeignKeyOptions
  ) {
    notNull({ entityClassOrName });

    const entity =
      typeof entityClassOrName === "function" ? entityClassOrName.name : entityClassOrName;

    let properties: readonly (keyof T)[] | undefined;

    if (typeof propertiesOrOptions === "object") {
      options = propertiesOrOptions as ForeignKeyOptions;
    } else {
      properties = array(propertiesOrOptions);
    }

    this.#foreignKeys = (this.#foreignKeys ?? []).push({
      entity,
      properties,
      onDelete: options?.onDelete,
    });

    return this;
  }

  table(name: string) {
    notEmpty({ name });

    this.#table = name;

    return this;
  }

  condition(condition: (entity: UnwrapProperties<T>) => boolean, name?: string) {
    notNull({ condition });

    this.#conditions = this.#conditions.push({ condition, name });

    return this;
  }

  concurrency(concurrency: { version: NumberKeys<UnwrapProperties<T>> }) {
    notNull({ concurrency });

    this.#concurrency = concurrency;

    return this;
  }

  data(...data: readonly Partial<O>[]) {
    this.#data = List(data);

    return this;
  }

  build(klass: Newable<unknown>) {
    const name = klass === Object ? `${ObjectNamePrefix}${objectNameCount++}` : klass.name;
    const properties = this.#properties;

    if (!properties || properties.isEmpty()) {
      throw new Error(`Entity '${name}' must have one or more properties defined.`);
    }

    const resolveScalar = (k: keyof T) => {
      const property = properties.find(p => p.name === k);

      if (!property) {
        throw new Error(`Property '${String(k)}' not found in entity '${name}'.`);
      }

      if (!(property instanceof ScalarPropertyModel)) {
        throw new Error(`Property '${String(k)}' in entity '${name}' must be a scalar property.`);
      }

      return property;
    };

    let key: KeyModel | undefined;

    if (this.#key) {
      key = new KeyModel(List(this.#key.map(k => resolveScalar(k).name)));
    }

    const foreignKeys = this.#foreignKeys.map(({ entity, properties, onDelete }) => {
      const names = (properties ?? []).map(k => String(k));

      return new ForeignKeyModel(entity, List(names), onDelete);
    });

    let concurrency: ConcurrencyModel | undefined;

    if (this.#concurrency) {
      const { version } = this.#concurrency;

      concurrency = new ConcurrencyModel(resolveScalar(version).name);
    }

    return new EntityModel<T>({
      name,
      klass,
      properties,
      key,
      foreignKeys,
      table: this.#table,
      conditions: this.#conditions,
      concurrency,
      data: this.#data,
    });
  }
}

/**
 * @ignore
 */
export class ValueObjectBuilderImpl<T extends object> {
  #properties?: List<PropertyModel>;

  constructor(private name: string) {}

  properties(properties: Properties<T>) {
    this.#properties = List<PropertyModel>().withMutations(l =>
      Object.entries(properties).forEach(([k, v]) => {
        const factory = v as (k: string) => PropertyModel;
        l.push(factory(k));
      })
    );

    return this;
  }

  build(klass: Newable<unknown>) {
    const properties = this.#properties;

    if (!properties || properties.isEmpty()) {
      throw new Error(`Value Object '${this.name}' must have one or more properties defined.`);
    }

    return new ValueObjectModel({
      name: this.name,
      klass,
      properties,
    });
  }
}

/**
 * Options shared by all scalar properties.
 * @template T - The property type.
 */
export type ScalarOptions<T> = {
  /**
   * The name of the property.
   */
  name: string;

  /**
   * The column name of the property.
   */
  column?: string | undefined;

  /**
   * The SQL type of the property.
   */
  type?: SqlType | undefined;

  /**
   * The nullability of the property.
   */
  nullable?: boolean | undefined;

  /**
   * Value generation options for the property.
   */
  generate?: GeneratorOptions<T> | undefined;

  /**
   * Value conversion options for the property.
   */
  convert?: ConversionOptions | undefined;
};

/**
 * String property options.
 */
export type StringOptions = ScalarOptions<string> & {
  /**
   * The maximum length allowed for property values.
   */
  maxLength?: number | undefined;
};

/**
 * Number property options.
 */
export type NumberOptions = ScalarOptions<number> & {
  /**
   * The precision of the property.
   */
  precision?: number | undefined;

  /**
   * The scale of the property.
   */
  scale?: number | undefined;
};

/**
 * The built-in identity generation strategies.
 *
 * - `seqhilo` - A _Hi/Lo_ sequence-based strategy.
 * - `identity` - A database identity column-based strategy.
 * - `uuid` - A UUID-based strategy.
 * - `none` - No generation strategy.
 *
 * @see [Hi/lo - Wikipedia](https://en.wikipedia.org/wiki/Hi/Lo_algorithm)
 */
export type Generator = "seqhilo" | "identity" | "uuid" | "none";

/**
 * Options for generating property values.
 * @template T - The property type.
 * @template E - The entity type.
 */
export type GeneratorOptions<T = unknown, E = unknown> = {
  /**
   * The generation strategy to use.
   */
  using?: Generator;

  /**
   * The sequence to use for the generation strategy.
   */
  sequence?: string;

  /**
   * When to generate the value.
   */
  on?: "add";

  /**
   * The default value, or a function to generate the default value.
   */
  default?: T | ((it: E) => T);
};

/**
 * Converters are functions that transform values from one type to another when reading from or
 * writing to the database.
 *
 * @template T The input type of the converter
 * @template S The output type of the converter
 */
export type Converter<T = any, S = any> = (value: T) => S;

/**
 * Options for converting property values.
 */
export type ConversionOptions = {
  /**
   * A function to convert values when reading from the database.
   */
  read: Converter;

  /**
   * A function to convert values when writing to the database.
   */
  write: Converter;
};

const generatorModel = (options?: GeneratorOptions) =>
  options ? new GeneratorModel(options) : undefined;

const conversionModel = (options?: ConversionOptions) =>
  options ? new ConversionModel(options) : undefined;

/**
 * Adds a nullable  integer property to the entity and allows for configuration of the property.
 *
 * @param options The options for the property.
 */
export function int(
  options: { nullable: true } & Omit<ScalarOptions<number>, "name">
): Property<number | undefined | null>;

/**
 * Adds an integer property to the entity and allows for configuration of the property.
 *
 * @param options The options for the property.
 */
export function int(options?: Omit<ScalarOptions<number>, "name">): Property<number>;

export function int(options?: Omit<ScalarOptions<number>, "name">) {
  return (name: string) =>
    new IntPropertyModel({
      ...options,
      name,
      generate: generatorModel(options?.generate),
      convert: conversionModel(options?.convert),
    });
}

/**
 * Adds a nullable string property to the entity and allows for configuration of the property.
 *
 * @param options The options for the property.
 */
export function string(
  options: { nullable: true } & Omit<StringOptions, "name">
): Property<string | undefined | null>;

/**
 * Adds a string property to the entity and allows for configuration of the property.
 *
 * @param options The options for the property.
 */
export function string(options?: Omit<StringOptions, "name">): Property<string>;

export function string(options?: Omit<StringOptions, "name">) {
  return (name: string) =>
    new StringPropertyModel({
      ...options,
      name,
      generate: generatorModel(options?.generate),
      convert: conversionModel(options?.convert),
    });
}

/**
 * Adds a nullable numeric property to the entity and allows for configuration of the property.
 * @param options The options for the property.
 */
export function number(
  options: { nullable: true } & Omit<NumberOptions, "name">
): Property<number | undefined | null>;

/**
 * Adds a numeric property to the entity and allows for configuration of the property.
 * @param options The options for the property.
 */
export function number(options?: Omit<NumberOptions, "name">): Property<number>;

export function number(options?: Omit<NumberOptions, "name">) {
  return (name: string) =>
    new NumberPropertyModel({
      ...options,
      name,
      generate: generatorModel(options?.generate),
      convert: conversionModel(options?.convert),
    });
}

/**
 * Adds a nullable boolean property to the entity and allows for configuration of the property.
 * @param options The options for the property.
 */
export function boolean(
  options: { nullable: true } & Omit<ScalarOptions<boolean>, "name">
): Property<boolean | undefined | null>;

/**
 * Adds a boolean property to the entity and allows for configuration of the property.
 * @param options The options for the property.
 */
export function boolean(options?: Omit<ScalarOptions<boolean>, "name">): Property<boolean>;

export function boolean(options?: Omit<ScalarOptions<boolean>, "name">) {
  return (name: string) =>
    new BooleanPropertyModel({
      ...options,
      name,
      generate: generatorModel(options?.generate),
      convert: conversionModel(options?.convert),
    });
}

/**
 * Adds a nullable {@link Date} property to the entity and allows for configuration of the property.
 * @param options The options for the property.
 */
export function date(
  options: { nullable: true } & Omit<ScalarOptions<Date>, "name">
): Property<Date | undefined | null>;

/**
 * Adds a {@link Date} property to the entity and allows for configuration of the property.
 * @param options The options for the property.
 */
export function date(options?: Omit<ScalarOptions<Date>, "name">): Property<Date>;

export function date(options?: Omit<ScalarOptions<Date>, "name">) {
  return (name: string) =>
    new DatePropertyModel({
      ...options,
      name,
      generate: generatorModel(options?.generate),
      convert: conversionModel(options?.convert),
    });
}

/**
 * Options for collection navigation properties.
 */
export type ManyOptions<T extends object> = {
  /**
   * The foreign key properties that reference the target entity.
   */
  foreignKey?: (keyof T | string | readonly (keyof T | string)[]) | undefined;

  /**
   * A default order by expression for the collection.
   */
  orderBy?: ((item: T) => unknown) | undefined;
};

/**
 * Adds a collection navigation property to the entity and allows for configuration of the property.
 * @param target The target entity class or name.
 * @param options The options for the collection navigation property.
 */
export const many = <T extends object>(
  target: Newable<T> | EntityModel<T> | string,
  options?: ManyOptions<T>
) =>
  ((name: string) => {
    const targetName = typeof target === "string" ? target : target.name;

    return new NavigationPropertyModel({
      name,
      targetName,
      many: true,
      nullable: false,
      orderBy: options?.orderBy,
      foreignKey: options?.foreignKey
        ? List(array(options.foreignKey)!.map(k => String(k)))
        : undefined,
    });
  }) as Property<T[]>;

/**
 * Options for reference navigation properties.
 */
export type OneOptions<T extends object> = {
  /**
   * The foreign key properties that reference the target entity.
   */
  foreignKey?: (keyof T | string | readonly (keyof T | string)[]) | undefined;

  /**
   * The nullability of the property.
   */
  nullable?: boolean | undefined;
};

/**
 * Adds a nullable reference navigation property to the entity and allows for configuration of the property.
 * @param target The target entity class or name.
 * @param options The options for the reference navigation property.
 */
export function one<T extends object>(
  target: Newable<T> | EntityModel<T> | string,
  options: { nullable: true } & OneOptions<T>
): Property<T | undefined | null>;

/**
 * Adds a reference navigation property to the entity and allows for configuration of the property.
 * @param target The target entity class or name.
 * @param options The options for the reference navigation property.
 */
export function one<T extends object>(
  target: Newable<T> | EntityModel<T> | string,
  options?: OneOptions<T>
): Property<T>;

export function one<T extends object>(
  target: Newable<T> | EntityModel<T> | string,
  options?: OneOptions<T>
) {
  return ((name: string) => {
    const targetName = typeof target === "string" ? target : target.name;

    return new NavigationPropertyModel({
      name,
      targetName,
      many: false,
      nullable: options?.nullable ?? false,
      foreignKey: options?.foreignKey
        ? List(array(options.foreignKey)!.map(k => String(k)))
        : undefined,
    });
  }) as Property<T>;
}

/**
 * Adds a value object property to the entity and allows for configuration of the property.
 * @param klass The value object class.
 * @param properties The properties of the value object.
 */
export function value<C extends object, P extends Properties<C>>(
  klass: Newable<C>,
  properties?: NonEmptyObject<P>
): Property<P>;

export function value<O extends object, P extends Properties<O>>(
  valueObjectModel: ValueObjectModel,
  properties?: NonEmptyObject<P>
): Property<P>;

export function value<T extends object, P extends Properties<T>>(
  klassOrModel: Newable<T> | ValueObjectModel,
  properties?: NonEmptyObject<P>
) {
  return ((name: string) => {
    let klass: Newable<unknown>;
    let targetName: string;

    if (typeof klassOrModel === "function") {
      klass = klassOrModel;
      targetName = klass.name;
    } else {
      klass = Object as Newable<unknown>;
      targetName = klassOrModel.name;
    }

    const builder = new ValueObjectBuilderImpl<T>(name);
    let config: ValueObjectModel | undefined;

    if (properties) {
      builder.properties(properties);
      config = builder.build(klass);
    }

    return new ValueObjectPropertyModel({ name, targetName, config });
  }) as Property<P>;
}
