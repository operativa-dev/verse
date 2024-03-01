/**
 * An immutable, persistent, and efficient data structure for modeling object/relational mapping metadata.
 *
 * @packageDocumentation
 */

import { hash, is, List, Map, ValueObject } from "immutable";
import rfdc from "rfdc";
import { Newable } from "ts-essentials";
import { SqlType } from "../db/sql.js";
import { EntityKey } from "../uow.js";
import { notEmpty, notNull } from "../utils/check.js";
import {
  ConversionOptions,
  GeneratorOptions,
  NumberOptions,
  ScalarOptions,
  StringOptions,
} from "./builder.js";
import { ModelRewriter } from "./rewriter.js";
import { ModelVisitor } from "./visitor.js";

/**
 * @ignore
 */
export const __parent = Symbol("__parent__");

/**
 * The base class for all model elements.
 */
export abstract class AbstractModel implements ValueObject {
  #parent?: AbstractModel;

  /**
   * Accepts a visitor and returns the result of visiting this model element.
   *
   * @param visitor The visitor to accept.
   * @param state An optional state to pass to the visitor.
   * @returns The result of visiting this model element.
   */
  abstract accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S): T;

  /**
   * Returns this instance as a plain object.
   * @returns The plain object.
   */
  abstract toObject(): object;

  /**
   * Rewrite method for processing a given model with a rewriter.
   * @param rewriter The rewriter to use for rewriting the model.
   * @return The rewritten model.
   */
  // @ts-ignore
  rewrite(rewriter: ModelRewriter): AbstractModel {
    return this;
  }

  /**
   * @ignore
   */
  [__parent](parent: AbstractModel) {
    if (!this.#parent) {
      this.#parent = parent;

      this.onBound();
    }
  }

  /**
   * Returns the parent model element.
   * @returns The parent model element.
   */
  get parent() {
    return this.#parent;
  }

  /**
   * Returns a JSON representation of this model element.
   * @returns The JSON representation.
   */
  toJSON() {
    return JSON.stringify(this.toObject(), null, "  ");
  }

  /**
   * @ignore
   */
  protected onBound() {}

  /**
   * Checks if the current object is equal to the provided object.
   *
   * @param other The object to compare with.
   * @returns Whether the objects are equal or not.
   */
  abstract equals(other: unknown): boolean;

  /**
   * Returns the hash code of this object.
   * @returns The hash code.
   */
  abstract hashCode(): number;
}

/**
 * The root model element.
 */
export class Model extends AbstractModel {
  readonly #entities: List<EntityModel>;
  readonly #values: List<ValueObjectModel>;
  readonly #sequences: List<SequenceModel>;
  readonly #conversions: Map<Newable<unknown>, ConversionModel>;

  constructor(
    entities: List<EntityModel>,
    values: List<ValueObjectModel> = List(),
    sequences: List<SequenceModel> = List(),
    conversions: Map<Newable<unknown>, ConversionModel> = Map()
  ) {
    super();

    notNull({ entities, values, sequences, converters: conversions });

    this.#validate(entities, "Entity", "name");
    this.#validate(entities, "Entity", "label");
    this.#validate(sequences, "Sequence", "name");

    this.#entities = entities;
    this.#values = values;
    this.#sequences = sequences;
    this.#conversions = conversions;
  }

  #validate<T>(items: List<T>, kind: string, property: keyof T) {
    const uniques = new Set<string>();

    items.forEach(it => {
      const next = it[property]! as string;

      if (next) {
        if (uniques.has(next)) {
          throw new Error(`${kind} with '${String(property)}=${next}' already exists.`);
        }

        uniques.add(next);
      }
    });
  }

  get entities() {
    return this.#entities;
  }

  get values() {
    return this.#values;
  }

  get sequences() {
    return this.#sequences;
  }

  override get parent(): never {
    return undefined as never;
  }

  entity(klass: Newable<unknown>): EntityModel;
  entity(name: string): EntityModel;
  entity(classOrName: Newable<unknown> | string) {
    notNull({ classOrName });

    const name = typeof classOrName === "function" ? classOrName.name : classOrName;

    const entity = this.entities.find(e => e.name === name);

    if (!entity) {
      throw new Error(`Entity with name '${name}' not found in model.`);
    }

    return entity;
  }

  entityByLabel(label: string) {
    let entity: EntityModel | undefined;

    entity = this.entities.find(e => e.label === label);

    if (!entity) {
      throw new Error(`Entity with label '${label}' not found in model.`);
    }

    return entity;
  }

  withEntities(entities: List<EntityModel>) {
    notEmpty({ entities });

    if (entities !== this.entities) {
      return new Model(entities, this.values, this.sequences, this.#conversions);
    }

    return this;
  }

  value(name: string) {
    notEmpty({ name });

    const value = this.values.find(e => e.name === name);

    if (!value) {
      throw new Error(`Value Object '${name}' not found in model.`);
    }

    return value;
  }

  sequence(name: string) {
    notEmpty({ name });

    const sequence = this.sequences.find(s => s.name === name);

    if (!sequence) {
      throw new Error(`Sequence '${name}' not found in model.`);
    }

    return sequence;
  }

  addSequence(sequence: SequenceModel) {
    notNull({ sequence });

    return new Model(this.entities, this.values, this.sequences.push(sequence), this.#conversions);
  }

  conversion(ctor?: Newable<unknown>) {
    if (!ctor) {
      return undefined;
    }

    return this.#conversions.get(ctor);
  }

  withConversion(ctor: Newable<unknown>, conversion: ConversionModel) {
    notNull({ ctor });
    notNull({ conversion });

    return new Model(
      this.entities,
      this.values,
      this.sequences,
      this.#conversions.set(ctor, conversion)
    );
  }

  override toObject() {
    return {
      entities: this.entities.map(e => e.toObject()).toArray(),
      values: this.values.map(e => e.toObject()).toArray(),
      sequences: this.sequences.map(e => e.toObject()).toArray(),
      conversions: this.#conversions.map(c => c.toObject()).toArray(),
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S) {
    return visitor.visitModel(this, state);
  }

  override rewrite(rewriter: ModelRewriter) {
    const newEntities = rewriter.rewriteList(this.entities);
    const newValues = rewriter.rewriteList(this.values);

    return this.entities !== newEntities || this.values !== newValues
      ? new Model(newEntities, newValues, this.sequences, this.#conversions)
      : this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof Model &&
        is(this.entities, other.entities) &&
        is(this.values, other.values) &&
        is(this.sequences, other.sequences) &&
        is(this.#conversions, other.#conversions))
    );
  }

  override hashCode() {
    return (
      (hash(this.entities) * 27) ^
      (hash(this.values) * 27) ^
      (hash(this.sequences) * 27) ^
      hash(this.#conversions)
    );
  }
}

/**
 * Models a database sequence.
 */
export class SequenceModel extends AbstractModel {
  readonly #name: string;
  readonly #start: number;
  readonly #increment: number;

  constructor(name: string, start: number, increment: number) {
    super();

    notEmpty({ name });

    this.#name = name;
    this.#start = start;
    this.#increment = increment;
  }

  get name(): string {
    return this.#name;
  }

  get start(): number {
    return this.#start;
  }

  get increment(): number {
    return this.#increment;
  }

  override toObject() {
    return {
      name: this.name,
      start: this.start,
      increment: this.increment,
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S) {
    return visitor.visitSequence(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof SequenceModel &&
        is(this.name, other.name) &&
        is(this.start, other.start) &&
        is(this.increment, other.increment))
    );
  }

  override hashCode() {
    return (hash(this.name) * 27) ^ (hash(this.start) * 27) ^ hash(this.increment);
  }
}

export type StructuralModelState = {
  name: string;
  klass: Newable<unknown>;
  properties: List<PropertyModel>;
};

export type ScalarPropertyPath = {
  path: List<ValueObjectPropertyModel>;
  scalar: ScalarPropertyModel;
};

/**
 * Base class for structural models.
 */
export abstract class StructuralModel extends AbstractModel {
  readonly #state: Readonly<StructuralModelState>;

  protected constructor(state: Readonly<StructuralModelState>) {
    super();

    notNull({ state });

    this.#state = { ...state };
  }

  get name() {
    return this.#state.name;
  }

  withName(name: string) {
    if (name !== this.name) {
      // @ts-ignore
      return new this.constructor({ ...this.state, name });
    }

    return this;
  }

  get klass() {
    return this.#state.klass;
  }

  get properties() {
    return this.#state.properties;
  }

  get allProperties() {
    return this.properties;
  }

  withProperty(property: PropertyModel) {
    if (this.properties.find(p => is(p, property))) {
      return this;
    }

    let properties = this.properties;

    const index = properties.findIndex(p => p.name === property.name);

    if (index === -1) {
      properties = properties.push(property);
    } else {
      properties = properties.set(index, property);
    }

    return this.withProperties(properties);
  }

  protected abstract withProperties(properties: List<PropertyModel>): StructuralModel;

  get scalars() {
    return this.#state.properties.filter(
      p => p instanceof ScalarPropertyModel
    ) as List<ScalarPropertyModel>;
  }

  get values() {
    return this.state.properties.filter(
      p => p instanceof ValueObjectPropertyModel
    ) as List<ValueObjectPropertyModel>;
  }

  get scalarsAndValues() {
    return this.scalars.concat(this.values);
  }

  scalar(name: string) {
    const scalar = this.scalars.find(p => p.name === name);

    if (!scalar) {
      throw new Error(`Scalar property '${name}' not found in entity '${this.name}'.`);
    }

    return scalar;
  }

  scalarFlatMap<T = ScalarPropertyPath>(action: (path: ScalarPropertyPath) => T = p => p as T) {
    const results: T[] = [];

    function traverse(
      model: StructuralModel,
      a: typeof action,
      path: List<ValueObjectPropertyModel>
    ) {
      for (const property of model.properties) {
        if (property instanceof ScalarPropertyModel) {
          results.push(a({ path, scalar: property }));
        } else if (property instanceof ValueObjectPropertyModel) {
          traverse(property.target, action, path.push(property));
        }
      }
    }

    traverse(this, action, List());

    return List(results);
  }

  protected get state() {
    return this.#state;
  }

  override get parent() {
    return super.parent as Model;
  }

  override toObject() {
    return {
      name: this.name,
      properties: this.properties.map(p => p.toObject()).toArray(),
    };
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof StructuralModel &&
        is(this.name, other.name) &&
        is(this.properties, other.properties))
    );
  }

  override hashCode() {
    return (hash(this.name) * 27) ^ (hash(this.properties) * 27);
  }
}

export type Condition = {
  condition: ((entity: any) => boolean) | string;
  name?: string | undefined;
};

export type EntityModelState = StructuralModelState & {
  label?: string | undefined;
  key?: KeyModel | undefined;
  foreignKeys: List<ForeignKeyModel>;
  table?: string | undefined;
  conditions: List<Condition>;
  concurrency?: ConcurrencyModel | undefined;
  data?: List<object> | undefined;
};

const clone = rfdc();

/**
 * Models an entity type.
 */
export class EntityModel<T extends object = any, O extends object = any> extends StructuralModel {
  #base?: EntityModel | undefined;
  #derived: List<EntityModel> = List();
  #dependents: List<ForeignKeyModel> = List();

  constructor(state: Readonly<EntityModelState>) {
    super(state);
  }

  get label() {
    return this.state.label!;
  }

  withLabel(label: string) {
    if (this.state.label && this.state.label !== label) {
      throw new Error("Entity label already set!");
    }

    return new EntityModel({ ...this.state, label });
  }

  get base() {
    return this.#base;
  }

  get root(): EntityModel {
    return this.base?.root ?? this;
  }

  get isRoot() {
    return !this.base;
  }

  get derived() {
    return this.#derived;
  }

  get key() {
    return this.root.state.key;
  }

  override get allProperties(): List<PropertyModel> {
    return this.base?.allProperties?.concat(this.properties) ?? this.properties;
  }

  withKey(key: KeyModel) {
    if (!this.isRoot) {
      throw new Error("Cannot override key of a derived entity.");
    }

    if (!is(this.key, key)) {
      const missing = key.names.find(n => !this.properties.some(p => p.name === n));

      if (missing) {
        throw new Error(
          `The key property '${missing}' is not a property of entity '${this.name}'.`
        );
      }

      return new EntityModel({ ...this.state, key });
    }

    return this;
  }

  override withProperty(property: PropertyModel) {
    return super.withProperty(property) as EntityModel<T>;
  }

  protected override withProperties(properties: List<PropertyModel>) {
    return new EntityModel({ ...this.state, key: this.key, properties });
  }

  get foreignKeys() {
    return this.state.foreignKeys;
  }

  withForeignKey(foreignKey: ForeignKeyModel) {
    if (this.foreignKeys.find(fk => is(fk, foreignKey))) {
      return this;
    }

    const foreignKeys = this.foreignKeys.push(foreignKey);

    return new EntityModel({ ...this.state, foreignKeys });
  }

  get navigations() {
    return this.state.properties.filter(
      p => p instanceof NavigationPropertyModel
    ) as List<NavigationPropertyModel>;
  }

  navigation(name: string) {
    const navigation = this.navigations.find(p => p.name === name);

    if (!navigation) {
      throw new Error(`Navigation property '${name}' not found in entity '${this.name}'.`);
    }

    return navigation;
  }

  get table() {
    return this.state.table;
  }

  withTable(table: string) {
    if (!this.isRoot) {
      throw new Error("Cannot override table of a derived entity.");
    }

    if (table !== this.table) {
      return new EntityModel({ ...this.state, table });
    }

    return this;
  }

  get conditions() {
    return this.state.conditions;
  }

  condition(name: string) {
    const condition = this.conditions.find(p => p.name === name);

    if (!condition) {
      throw new Error(`Condition '${name}' not found in entity '${this.name}'.`);
    }

    return condition;
  }

  withCondition(condition: Condition) {
    if (this.conditions.find(c => c.name === condition.name)) {
      return this;
    }

    const conditions = this.conditions.push(condition);

    return new EntityModel({ ...this.state, conditions });
  }

  get concurrency() {
    return this.state.concurrency;
  }

  withConcurrency(concurrency: ConcurrencyModel) {
    if (!is(this.concurrency, concurrency)) {
      return new EntityModel({ ...this.state, concurrency });
    }

    return this;
  }

  get data() {
    return this.state.data?.map(clone);
  }

  get dependents() {
    return this.#dependents;
  }

  protected override onBound() {
    const baseClass = Object.getPrototypeOf(this.klass);

    this.#base = this.parent.entities.find(e => e.klass === baseClass);

    if (this.#base) {
      this.#base.#addDerived(this);
    }

    this.#dependents = this.parent.entities
      .flatMap(e => e.foreignKeys)
      .filter(fk => fk.targetName === this.name);
  }

  #addDerived(derived: EntityModel) {
    this.#derived = this.#derived.push(derived);
  }

  protected override get state() {
    return super.state as EntityModelState;
  }

  override toObject() {
    return {
      ...super.toObject(),
      label: this.label,
      table: this.table,
      key: this.key?.toObject(),
      foreignKeys: this.foreignKeys.map(fk => fk.toObject()).toArray(),
      conditions: this.conditions.toArray(),
      concurrency: this.concurrency?.toObject(),
      data: this.data,
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S) {
    return visitor.visitEntity(this, state);
  }

  override rewrite(rewriter: ModelRewriter): EntityModel<T, O> {
    const key = (this.key ? this.key.accept(rewriter) : this.key) as KeyModel | undefined;
    const foreignKeys = rewriter.rewriteList(this.foreignKeys);
    const properties = rewriter.rewriteList(this.properties);

    return this.properties !== properties || this.key !== key || this.foreignKeys !== foreignKeys
      ? new EntityModel({ ...this.state, properties, key, foreignKeys })
      : this;
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof EntityModel &&
        super.equals(other) &&
        is(this.key, other.key) &&
        is(this.foreignKeys, other.foreignKeys) &&
        is(this.table, other.table) &&
        is(this.conditions, other.conditions) &&
        is(this.concurrency, other.concurrency))
    );
  }

  override hashCode() {
    return (
      (super.hashCode() * 27) ^
      (hash(this.key) * 27) ^
      (hash(this.foreignKeys) * 27) ^
      (hash(this.table) * 27) ^
      (hash(this.conditions) * 27) ^
      (hash(this.concurrency) * 27)
    );
  }
}

/**
 * Models a primary key.
 */
export class KeyModel extends AbstractModel {
  readonly #names: List<string>;

  #properties?: List<ScalarPropertyModel>;

  constructor(names: List<string>) {
    super();

    notEmpty({ names });

    this.#names = names;
  }

  get names() {
    return this.#names;
  }

  get properties() {
    if (!this.#properties) {
      throw new Error("Property 'properties' not bound!");
    }

    return this.#properties!;
  }

  get composite() {
    return this.#names.size > 1;
  }

  keyOf(entity: any) {
    notNull({ entity });

    const values = [];

    for (const name of this.#names) {
      const value = entity[name];

      if (value === undefined || value == null || value === "") {
        return undefined;
      }
      values.push(value);
    }

    return List(values);
  }

  protected override onBound() {
    this.#properties = List(this.names).map(n => this.parent.scalar(n));
  }

  override get parent() {
    return super.parent as EntityModel;
  }

  override toObject() {
    return this.names.toArray();
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S) {
    return visitor.visitKey(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof KeyModel && this.names.equals(other.names));
  }

  override hashCode() {
    return hash(this.names);
  }
}

/**
 * Action to take when a referenced entity is deleted.
 *
 * - `cascade` - Delete all dependent entities.
 * - `restrict` - Prevent deletion of the referenced entity.
 * - `set null` - Set the foreign key to null.
 * - `set default` - Set the foreign key to its default value.
 * - `no action` - Do nothing.
 */
export type OnDelete = "cascade" | "restrict" | "set null" | "set default" | "no action";

/**
 * Models a foreign key.
 */
export class ForeignKeyModel extends AbstractModel {
  readonly #targetName: string;
  readonly #names?: List<string> | undefined;
  readonly #onDelete?: OnDelete | undefined;

  #properties?: List<ScalarPropertyModel>;
  #references?: EntityModel;
  #principal?: NavigationPropertyModel | undefined;
  #dependent?: NavigationPropertyModel | undefined;

  constructor(targetName: string, names?: List<string>, onDelete?: OnDelete) {
    super();

    notEmpty({ targetName });

    this.#targetName = targetName;
    this.#names = names;
    this.#onDelete = onDelete;
  }

  get targetName() {
    return this.#targetName;
  }

  withTargetName(targetName: string) {
    if (targetName !== this.targetName) {
      return new ForeignKeyModel(targetName, this.names, this.onDelete);
    }

    return this;
  }

  get names() {
    return this.#names;
  }

  get onDelete() {
    return this.#onDelete;
  }

  withOnDelete(onDelete: OnDelete) {
    if (onDelete !== this.onDelete) {
      return new ForeignKeyModel(this.targetName, this.names, onDelete);
    }

    return this;
  }

  get properties() {
    if (!this.#properties) {
      throw new Error("Property 'properties' not bound!");
    }

    return this.#properties!;
  }

  get references() {
    if (!this.#references) {
      throw new Error("Property 'references' not bound!");
    }

    return this.#references!;
  }

  value(entity: object) {
    notNull({ entity });

    const obj = entity as any;
    const values = [];

    for (const name of this.#names!) {
      values.push(obj[name]);
    }

    return List(values);
  }

  set(entity: object, key?: EntityKey) {
    const obj = entity as any;

    for (let i = 0; i < this.#names!.size; i++) {
      obj[this.#names!.get(i)!] = key?.get(i);
    }
  }

  get required() {
    return this.properties.some(p => !p.nullable);
  }

  get principal() {
    return this.#principal;
  }

  get dependent() {
    return this.#dependent;
  }

  protected override onBound() {
    this.#properties = this.names?.map(n => this.parent.scalar(n))!;
    this.#references = this.parent.parent.entity(this.targetName)!;
    this.#principal = this.#references?.navigations.find(n => is(n.foreignKeyNames, this.names));
    this.#dependent = this.parent?.navigations.find(n => is(n.foreignKeyNames, this.names));
  }

  override get parent() {
    return super.parent as EntityModel;
  }

  override toObject() {
    return {
      references: this.targetName,
      properties: this.names?.toArray(),
      onDelete: this.onDelete,
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S) {
    return visitor.visitForeignKey(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof ForeignKeyModel &&
        is(this.targetName, other.targetName) &&
        is(this.names, other.names) &&
        is(this.onDelete, other.onDelete))
    );
  }

  override hashCode() {
    return (hash(this.targetName) * 27) ^ (hash(this.names) * 27) ^ (hash(this.onDelete) * 27);
  }
}

/**
 * Models concurrency options for an entity.
 */
export class ConcurrencyModel extends AbstractModel {
  readonly #versionName: string;

  constructor(versionName: string) {
    super();

    notEmpty({ versionName });

    this.#versionName = versionName;
  }

  get versionName() {
    return this.#versionName;
  }

  get version() {
    return this.parent.scalar(this.versionName);
  }

  override get parent() {
    return super.parent as EntityModel;
  }

  override toObject() {
    return {
      version: this.versionName,
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S) {
    return visitor.visitConcurrency(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof ConcurrencyModel && is(this.version, other.version));
  }

  override hashCode() {
    return hash(this.version) ^ 31;
  }
}

type ValueObjectModelState = StructuralModelState;

/**
 * Models a value object.
 */
export class ValueObjectModel extends StructuralModel {
  constructor(state: Readonly<ValueObjectModelState>) {
    super(state);

    if (this.properties.some(p => p instanceof NavigationPropertyModel)) {
      throw new Error("Value Object cannot have navigation properties.");
    }
  }

  protected override withProperties(properties: List<PropertyModel>) {
    return new ValueObjectModel({ ...this.state, properties });
  }

  protected override get state() {
    return super.state as ValueObjectModelState;
  }

  merge(config: ValueObjectModel) {
    return new ValueObjectModel({
      name: this.name,
      klass: this.klass,
      properties: this.properties.map(p1 =>
        p1.merge(config.properties.find(p2 => p1.name === p2.name))
      ),
    });
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S) {
    return visitor.visitValueObject(this, state);
  }

  override rewrite(rewriter: ModelRewriter) {
    const properties = rewriter.rewriteList(this.properties);

    return this.properties !== properties
      ? new ValueObjectModel({ ...this.state, properties })
      : this;
  }

  override equals(other: unknown) {
    return this === other || (other instanceof ValueObjectModel && super.equals(other));
  }
}

/**
 * Base class for property models.
 */
export abstract class PropertyModel extends AbstractModel {
  abstract readonly name: string;

  merge(override?: PropertyModel) {
    return override ?? this;
  }
}

export type ScalarPropertyModelState = Omit<ScalarOptions, "generate" | "convert"> & {
  generate?: GeneratorModel | undefined;
  convert?: ConversionModel | undefined;
};

/**
 * Base class for scalar property models.
 */
export abstract class ScalarPropertyModel extends PropertyModel {
  readonly #state: Readonly<ScalarPropertyModelState>;

  #principal?: ScalarPropertyModel;

  protected constructor(state: Readonly<ScalarPropertyModelState>) {
    super();

    notNull({ state });

    this.#state = { ...state };
  }

  get name() {
    return this.state.name;
  }

  get column() {
    return this.state.column;
  }

  withColumn(column: string) {
    if (column !== this.column) {
      // @ts-ignore
      return new this.constructor({ ...this.state, column });
    }

    return this;
  }

  get type() {
    return this.state.type;
  }

  withType(type: SqlType) {
    if (type !== this.type) {
      // @ts-ignore
      return new this.constructor({ ...this.state, type });
    }

    return this;
  }

  get nullable() {
    return this.state.nullable;
  }

  withNullable(nullable: boolean) {
    if (nullable !== this.nullable) {
      // @ts-ignore
      return new this.constructor({ ...this.state, nullable });
    }

    return this;
  }

  get generate() {
    return this.state.generate;
  }

  withGenerate(generate: GeneratorModel) {
    if (!is(this.generate, generate)) {
      // @ts-ignore
      return new this.constructor({ ...this.state, generate });
    }

    return this;
  }

  get storeGenerated() {
    return this.generate?.using === "identity";
  }

  get convert() {
    return (
      this.state.convert ??
      (this.parent ? this.parent.parent.conversion(this.valueCtor) : undefined)
    );
  }

  protected abstract get valueCtor(): Newable<unknown>;

  withConvert(convert: ConversionModel) {
    if (!is(this.convert, convert)) {
      // @ts-ignore
      return new this.constructor({ ...this.state, convert });
    }

    return this;
  }

  override merge(override?: PropertyModel) {
    if (!override || is(this, override)) {
      return this;
    }

    const scalar = override as ScalarPropertyModel;

    // @ts-ignore
    return new this.constructor({
      ...this.state,
      ...scalar.state,
    });
  }

  protected get state() {
    return this.#state;
  }

  override get parent() {
    return super.parent as EntityModel;
  }

  get principal() {
    return this.#principal;
  }

  override toObject() {
    return {
      name: this.name,
      column: this.column,
      type: this.type,
      nullable: this.nullable,
      generate: this.generate?.toObject(),
      convert: this.convert?.toObject(),
    };
  }

  protected override onBound() {
    for (const fk of this.parent.foreignKeys ?? List()) {
      const index = fk.properties.findIndex(p => p === this);

      if (index !== -1) {
        this.#principal = fk.references.key?.properties.get(index)!;
        break;
      }
    }
  }

  abstract override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S): T;

  equals(other: unknown) {
    return (
      this === other ||
      (other instanceof ScalarPropertyModel &&
        is(this.name, other.name) &&
        is(this.column, other.column) &&
        is(this.type, other.type) &&
        is(this.nullable, other.nullable) &&
        is(this.generate, other.generate) &&
        is(this.convert, other.convert))
    );
  }

  hashCode() {
    return (
      (hash(this.name) * 27) ^
      (hash(this.column) * 27) ^
      (hash(this.type) * 27) ^
      (hash(this.nullable) * 27) ^
      (hash(this.generate) * 27) ^
      hash(this.convert)
    );
  }
}

export type StringPropertyModelState = ScalarPropertyModelState & Pick<StringOptions, "maxLength">;

/**
 * Models a string property.
 */
export class StringPropertyModel extends ScalarPropertyModel {
  constructor(state: Readonly<StringPropertyModelState>) {
    super(state);
  }

  get maxLength() {
    return this.state.maxLength;
  }

  withMaxLength(maxLength: number) {
    if (maxLength !== this.maxLength) {
      return new StringPropertyModel({ ...this.state, maxLength });
    }

    return this;
  }

  protected override get state() {
    return super.state as StringPropertyModelState;
  }

  protected override get valueCtor() {
    return String;
  }

  override toObject() {
    return {
      ...super.toObject(),
      kind: "string",
      maxLength: this.maxLength,
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S): T {
    return visitor.visitStringProperty(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof StringPropertyModel &&
        super.equals(other) &&
        is(this.maxLength, other.maxLength))
    );
  }

  override hashCode() {
    return (super.hashCode() * 27) ^ hash(this.maxLength);
  }
}

/**
 * Models an integer property.
 */
export class IntPropertyModel extends ScalarPropertyModel {
  constructor(state: Readonly<ScalarPropertyModelState>) {
    super(state);
  }

  protected override get valueCtor() {
    return Number;
  }

  override toObject() {
    return {
      ...super.toObject(),
      kind: "int",
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S): T {
    return visitor.visitIntProperty(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof IntPropertyModel && super.equals(other));
  }
}

/**
 * Models a boolean property.
 */
export class BooleanPropertyModel extends ScalarPropertyModel {
  constructor(state: Readonly<ScalarPropertyModelState>) {
    super(state);
  }

  protected override get valueCtor() {
    return Boolean;
  }

  override toObject() {
    return {
      ...super.toObject(),
      kind: "boolean",
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S): T {
    return visitor.visitBooleanProperty(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof BooleanPropertyModel && super.equals(other));
  }
}

/**
 * Models a Date property.
 */
export class DatePropertyModel extends ScalarPropertyModel {
  constructor(state: Readonly<ScalarPropertyModelState>) {
    super(state);
  }

  protected override get valueCtor() {
    return Date;
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S): T {
    return visitor.visitDateProperty(this, state);
  }

  override equals(other: unknown) {
    return this === other || (other instanceof DatePropertyModel && super.equals(other));
  }
}

/**
 * Models a number property.
 */
export type NumberPropertyModelState = ScalarPropertyModelState &
  Pick<NumberOptions, "precision" | "scale">;

export class NumberPropertyModel extends ScalarPropertyModel {
  constructor(state: Readonly<NumberPropertyModelState>) {
    super(state);
  }

  get precision() {
    return this.state.precision;
  }

  withPrecision(precision: number) {
    if (precision !== this.precision) {
      return new NumberPropertyModel({ ...this.state, precision });
    }

    return this;
  }

  get scale() {
    return this.state.scale;
  }

  withScale(scale: number) {
    if (scale !== this.scale) {
      return new NumberPropertyModel({ ...this.state, scale });
    }

    return this;
  }

  protected override get valueCtor() {
    return Number;
  }

  protected override get state() {
    return super.state as NumberPropertyModelState;
  }

  override toObject() {
    return {
      ...super.toObject(),
      kind: "number",
      precision: this.precision,
      scale: this.scale,
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S): T {
    return visitor.visitNumberProperty(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof NumberPropertyModel &&
        super.equals(other) &&
        is(this.precision, other.precision) &&
        is(this.scale, other.scale))
    );
  }

  override hashCode() {
    return (super.hashCode() * 27) ^ (hash(this.precision) * 27) ^ hash(this.scale);
  }
}

export type ReferencePropertyModelState = {
  name: string;
  targetName: string;
};

/**
 * Base class for reference property models.
 */
export abstract class ReferencePropertyModel extends PropertyModel {
  readonly #state: Readonly<ReferencePropertyModelState>;

  #target?: StructuralModel;

  protected constructor(state: Readonly<ReferencePropertyModelState>) {
    super();

    notNull({ state });

    this.#state = { ...state };
  }

  override get name() {
    return this.#state.name;
  }

  get targetName() {
    return this.#state.targetName;
  }

  get target() {
    if (!this.#target) {
      throw new Error("Property 'target' not bound!");
    }

    return this.#target!;
  }

  protected get state() {
    return this.#state;
  }

  override get parent() {
    return super.parent as EntityModel;
  }

  protected override onBound() {
    this.#target = this.resolveTarget();
  }

  protected abstract resolveTarget(): StructuralModel;

  override toObject() {
    return {
      name: this.name,
      target: this.targetName,
    };
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof ReferencePropertyModel &&
        is(this.name, other.name) &&
        is(this.targetName, other.targetName))
    );
  }

  override hashCode() {
    return (hash(this.name) * 27) ^ (hash(this.targetName) * 27);
  }
}

export type NavigationPropertyModelState = ReferencePropertyModelState & {
  many: boolean;
  nullable: boolean;
  foreignKey?: List<string> | undefined;
  orderBy?: ((item: any) => unknown) | undefined;
};

/**
 * Models a navigation property.
 */
export class NavigationPropertyModel extends ReferencePropertyModel {
  #foreignKey?: ForeignKeyModel | undefined;

  constructor(state: Readonly<NavigationPropertyModelState>) {
    super(state);
  }

  withTargetName(targetName: string) {
    if (targetName !== this.targetName) {
      return new NavigationPropertyModel({ ...this.state, targetName });
    }

    return this;
  }

  get foreignKey() {
    if (!this.#foreignKey) {
      throw new Error("Property 'foreignKey' not bound!");
    }

    return this.#foreignKey;
  }

  withForeignKey(foreignKey: List<string>) {
    if (!is(this.foreignKeyNames, foreignKey)) {
      return new NavigationPropertyModel({ ...this.state, foreignKey });
    }

    return this;
  }

  get foreignKeyNames() {
    return this.state.foreignKey;
  }

  get many() {
    return this.state.many;
  }

  get nullable() {
    return this.state.nullable;
  }

  get orderBy() {
    return this.state.orderBy;
  }

  override get target() {
    return super.target as EntityModel;
  }

  protected override get state() {
    return super.state as NavigationPropertyModelState;
  }

  protected override onBound() {
    super.onBound();

    const dependent = this.many ? this.parent.parent.entity(this.targetName) : this.parent;

    this.#foreignKey = dependent.foreignKeys.find(fk => is(fk.names, this.foreignKeyNames));
  }

  protected override resolveTarget() {
    return this.parent.parent.entity(this.targetName)!;
  }

  override toObject() {
    return {
      ...super.toObject(),
      foreignKey: this.foreignKeyNames?.toArray(),
      many: this.many,
      nullable: this.nullable,
      orderBy: this.orderBy?.toString(),
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S): T {
    return visitor.visitNavigationProperty(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof NavigationPropertyModel &&
        super.equals(other) &&
        is(this.foreignKeyNames, other.foreignKeyNames) &&
        is(this.many, other.many) &&
        is(this.nullable, other.nullable) &&
        is(this.orderBy, other.orderBy))
    );
  }

  override hashCode() {
    return (
      super.hashCode() ^
      (hash(this.foreignKeyNames) * 27) ^
      (hash(this.many) * 27) ^
      (hash(this.nullable) * 27) ^
      (hash(this.orderBy) * 27)
    );
  }
}

export type ValuePropertyModelState = ReferencePropertyModelState & {
  config?: ValueObjectModel | undefined;
};

/**
 * Models a value object property.
 */
export class ValueObjectPropertyModel extends ReferencePropertyModel {
  constructor(state: Readonly<ValuePropertyModelState>) {
    super(state);
  }

  override get target() {
    return super.target as ValueObjectModel;
  }

  protected override get state() {
    return super.state as ValuePropertyModelState;
  }

  protected override resolveTarget() {
    let target = this.parent.parent.value(this.targetName)!;

    if (this.state.config) {
      target = target.merge(this.state.config);
    }

    return target;
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S) {
    return visitor.visitValueObjectProperty(this, state);
  }
}

/**
 * Models value generation options for a scalar property.
 */
export class GeneratorModel extends AbstractModel {
  #state: Readonly<GeneratorOptions>;

  constructor(state: Readonly<GeneratorOptions>) {
    super();

    notNull({ state });

    this.#state = { ...state };
  }

  get using() {
    return this.#state.using;
  }

  get sequence() {
    return this.#state.sequence;
  }

  get on() {
    return this.#state.on;
  }

  get default() {
    return this.#state.default;
  }

  override toObject() {
    return {
      using: this.using,
      sequence: this.sequence,
      on: this.on,
      default: this.default,
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S) {
    return visitor.visitGenerator(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof GeneratorModel &&
        is(this.using, other.using) &&
        is(this.sequence, other.sequence) &&
        is(this.on, other.on))
    );
  }

  override hashCode() {
    return (hash(this.using) * 27) ^ (hash(this.sequence) * 27) ^ hash(this.on);
  }
}

/**
 * Models conversion options for a scalar property.
 */
export class ConversionModel extends AbstractModel {
  readonly #state: Readonly<ConversionOptions>;

  constructor(state: Readonly<ConversionOptions>) {
    super();

    notNull({ state });

    this.#state = { ...state };
  }

  get read() {
    return this.#state.read;
  }

  get write() {
    return this.#state.write;
  }

  override toObject() {
    return {
      read: this.read.toString(),
      write: this.write.toString(),
    };
  }

  override accept<T, S = unknown>(visitor: ModelVisitor<T, S>, state?: S) {
    return visitor.visitConversion(this, state);
  }

  override equals(other: unknown) {
    return (
      this === other ||
      (other instanceof ConversionModel && is(this.read, other.read) && is(this.write, other.write))
    );
  }

  override hashCode() {
    return (hash(this.read) * 27) ^ hash(this.write);
  }
}
