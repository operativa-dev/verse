import camelcase from "camelcase";
import { is, List } from "immutable";
import { Newable } from "ts-essentials";
import { parse, stringify } from "uuid";
import {
  BooleanPropertyModel,
  ConcurrencyModel,
  ConversionModel,
  DatePropertyModel,
  EntityModel,
  ForeignKeyModel,
  GeneratorModel,
  IntPropertyModel,
  KeyModel,
  Model,
  NavigationPropertyModel,
  NumberPropertyModel,
  ScalarPropertyModel,
  SequenceModel,
  StringPropertyModel,
} from "../model/model.js";

import { AbstractConvention } from "./convention.js";

export const DEFAULT_SEQUENCE = "__verse_seqhilo";

export class DefaultSequence extends AbstractConvention {
  constructor(
    readonly name = DEFAULT_SEQUENCE,
    readonly start = 1,
    readonly increment = 10
  ) {
    super();
  }

  override visitModel(model: Model) {
    if (!model.sequences.some(s => s.name === this.name)) {
      return model.addSequence(new SequenceModel(this.name, this.start, this.increment));
    }
    return model;
  }
}

export class SeqHiloKey extends AbstractConvention {
  constructor(readonly sequence = DEFAULT_SEQUENCE) {
    super();
  }

  override visitEntity(entity: EntityModel) {
    if (entity.key && !entity.key.composite) {
      const property = entity.scalar(entity.key.names.first()!);

      if (property instanceof IntPropertyModel) {
        const generate = property.generate;

        if (!generate || (generate.using === "seqhilo" && !generate.sequence)) {
          return entity.withProperty(
            property.withGenerate(
              new GeneratorModel({
                ...generate,
                using: "seqhilo",
                sequence: this.sequence,
              })
            )
          );
        }
      }
    }

    return entity;
  }
}

export class IdentityKey extends AbstractConvention {
  override visitEntity(entity: EntityModel) {
    if (entity.key && !entity.key.composite) {
      const property = entity.scalar(entity.key.names.first()!);

      if (property instanceof IntPropertyModel) {
        if (!property.generate) {
          return entity.withProperty(
            property.withGenerate(
              new GeneratorModel({
                using: "identity",
              })
            )
          );
        }
      }
    }

    return entity;
  }
}

export class TableFromEntityName extends AbstractConvention {
  override visitEntity(entity: EntityModel) {
    if (!entity.table) {
      return entity.withTable(entity.name);
    }

    return entity;
  }
}

export const TYPE_CONDITION = "type";
export const TYPE_COLUMN = "__verse_type";

export class UseSingleTableInheritance extends AbstractConvention {
  #model?: Model;
  #conditions = new Map<Newable<unknown>, [root: boolean, conditions: Set<string>]>();

  constructor(readonly typeColumn = TYPE_COLUMN) {
    super();
  }

  override visitModel(model: Model) {
    this.#model = model;
    this.#conditions.clear();

    const newModel = super.visitModel(model);

    const newEntities = newModel.entities.withMutations(l =>
      l.map(e => {
        const item = this.#conditions.get(e.klass);

        if (item) {
          const [root, conditions] = item;

          if (root) {
            if (!e.properties.find(p => p.name === this.typeColumn)) {
              e = e.withProperty(
                new StringPropertyModel({
                  name: this.typeColumn,
                  nullable: false,
                  column: this.typeColumn,
                  generate: new GeneratorModel({
                    default: (it: any) => it.constructor.name,
                  }),
                })
              );
            }
          }

          const expression = `e => ${[...conditions]
            .map(c => `e.${this.typeColumn} == "${c}"`)
            .join(" || ")}`;

          e = e.withCondition({
            name: TYPE_CONDITION,
            condition: expression,
          });
        }

        return e;
      })
    );

    return newModel.withEntities(newEntities);
  }

  override visitEntity(entity: EntityModel) {
    if (!this.#model || entity.conditions.find(c => c.name === TYPE_CONDITION)) {
      return entity;
    }

    const base = this.#baseEntity(entity);

    if (base) {
      let root = base;
      let next = entity as EntityModel | undefined;

      while (next) {
        if (!this.#conditions.has(next.klass)) {
          this.#conditions.set(next.klass, [false, new Set()]);
        }

        const condition = this.#conditions.get(next.klass)!;

        root = next;
        next = this.#baseEntity(next);

        condition[0] = next === undefined;
        condition[1].add(entity.name);

        if (condition[0]) {
          condition[1].add(root.name);
        }
      }

      if (root?.table && entity.table !== root.table) {
        return entity.withTable(root.table);
      }
    }

    return entity;
  }

  #baseEntity(entity: EntityModel) {
    if (this.#model) {
      const baseClass = Object.getPrototypeOf(entity.klass);

      return this.#model.entities.find(e => e.klass === baseClass);
    }

    return undefined;
  }
}

export class ColumnFromPascalCasedPropertyName extends AbstractConvention {
  override visitScalarProperty(scalarProperty: ScalarPropertyModel) {
    if (!scalarProperty.column) {
      return scalarProperty.withColumn(camelcase(scalarProperty.name, { pascalCase: true }));
    }

    return scalarProperty;
  }
}

export class PrimaryKeyFromProperty extends AbstractConvention {
  override visitEntity(entity: EntityModel) {
    if (entity.key) {
      return entity;
    }

    const id = entity.scalars.find(
      p => p.name === "id" || p.name === `${camelcase(entity.name)}Id`
    );

    return id ? entity.withKey(new KeyModel(List.of(id.name))) : entity;
  }
}

export class VersionProperty extends AbstractConvention {
  override visitEntity(entity: EntityModel) {
    if (entity.concurrency) {
      return entity;
    }

    let version = entity.scalars.find(
      p => p.name === "version" && !p.nullable && p instanceof IntPropertyModel
    ) as IntPropertyModel | undefined;

    if (version) {
      if (!version.generate) {
        version = version.withGenerate(
          new GeneratorModel({
            default: 1,
          })
        ) as IntPropertyModel;

        entity = entity.withProperty(version);
      }

      return entity.withConcurrency(new ConcurrencyModel(version.name));
    }

    return entity;
  }
}

export abstract class AbstractForeignKeyConvention extends AbstractConvention {
  override visitModel(model: Model) {
    let changed = false;

    const entities = new Map<string, EntityModel>(model.entities.map(e => [e.name, e]));

    for (let [dependentName, dependent] of entities) {
      for (let [principalName, principal] of entities) {
        if (principal.key) {
          const manyNavigations = principal.navigations.filter(
            n => n.targetName === dependentName && !n.foreignKeyNames && n.many
          );

          const oneNavigations = dependent.navigations.filter(
            n => n.targetName === principalName && !n.foreignKeyNames && !n.many
          );

          if (
            (manyNavigations.size === 1 && oneNavigations.size === 1) ||
            (manyNavigations.size === 1 && oneNavigations.size === 0) ||
            (manyNavigations.size === 0 && oneNavigations.size === 1)
          ) {
            const manyNavigation = manyNavigations.first();
            const oneNavigation = oneNavigations.first();
            const fkPropertyNames = this.findForeignKey(principal, dependent);

            if (
              !is(dependent.key!.names, fkPropertyNames) &&
              fkPropertyNames.size === principal.key.names.size
            ) {
              let newDependent = dependent.withForeignKey(
                new ForeignKeyModel(principal.name, fkPropertyNames)
              );

              if (oneNavigation) {
                newDependent = newDependent.withProperty(
                  oneNavigation.withForeignKey(fkPropertyNames)
                );
              }

              if (newDependent !== dependent) {
                entities.set(dependent.name, newDependent);
                dependent = newDependent;
              }

              if (manyNavigation) {
                const newPrincipal = principal.withProperty(
                  manyNavigation.withForeignKey(fkPropertyNames)
                );

                if (newPrincipal !== principal) {
                  entities.set(principal.name, newPrincipal);
                }
              }

              changed = true;
            }
          }
        }
      }
    }

    return changed ? model.withEntities(List(entities.values())) : model;
  }

  protected abstract findForeignKey(principal: EntityModel, dependent: EntityModel): List<string>;
}

export class ForeignKeyFromPrimaryKeyName extends AbstractForeignKeyConvention {
  protected override findForeignKey(principal: EntityModel, dependent: EntityModel) {
    return principal
      .key!.names.map(n => dependent.scalars.find(p => p.name === n))
      .filter(p => p)
      .map(p => p!.name);
  }
}

export class ForeignKeyFromEntityNameAndPrimaryKeyName extends AbstractForeignKeyConvention {
  protected override findForeignKey(principal: EntityModel, dependent: EntityModel) {
    const prefix = camelcase(principal.name);

    return principal
      .key!.names.map(n =>
        dependent.scalars.find(p => p.name === prefix + camelcase(n, { pascalCase: true }))
      )
      .filter(p => p)
      .map(p => p!.name);
  }
}

export class ForeignKeyOnDelete extends AbstractConvention {
  #entity!: EntityModel;

  override visitEntity(entity: EntityModel) {
    this.#entity = entity;

    return super.visitEntity(entity);
  }

  override visitForeignKey(foreignKey: ForeignKeyModel) {
    if (!foreignKey.onDelete) {
      const properties = foreignKey.names?.map(n => this.#entity.scalar(n))!;
      const required = properties.some(p => p.nullable === false);

      return foreignKey.withOnDelete(required ? "cascade" : "set null");
    }

    return foreignKey;
  }
}

export class NavigationForeignKeyFromDependent extends AbstractConvention {
  #model!: Model;
  #entity!: EntityModel;

  override visitModel(model: Model) {
    this.#model = model;

    return super.visitModel(model);
  }

  override visitEntity(entity: EntityModel) {
    this.#entity = entity;

    return super.visitEntity(entity);
  }

  override visitNavigationProperty(navigation: NavigationPropertyModel) {
    if (!navigation.foreignKeyNames) {
      const other = this.#model.entity(navigation.targetName);

      let dependent: EntityModel;
      let principal: EntityModel;

      if (navigation.many) {
        dependent = other;
        principal = this.#entity;
      } else {
        dependent = this.#entity;
        principal = other;
      }

      const candidates = dependent.foreignKeys.filter(fk => fk.targetName === principal.name);

      if (candidates.size === 1) {
        return navigation.withForeignKey(candidates.first()!.names!);
      }
    }

    return navigation;
  }
}

export class ForeignKeyFromNavigation extends AbstractConvention {
  #model!: Model;
  #entity!: EntityModel;

  #foreignKeys = new Map<EntityModel, List<ForeignKeyModel>>();

  override visitModel(model: Model) {
    this.#model = model;

    return super.visitModel(model);
  }

  override visitEntity(entity: EntityModel) {
    this.#entity = entity;

    entity = super.visitEntity(entity);

    const foreignKeys = this.#foreignKeys.get(entity);

    foreignKeys?.forEach(fk => {
      entity = entity.withForeignKey(fk);
    });

    return entity;
  }

  override visitNavigationProperty(navigation: NavigationPropertyModel) {
    if (navigation.foreignKeyNames) {
      const other = this.#model.entity(navigation.targetName);

      let dependent: EntityModel;
      let principal: EntityModel;

      if (navigation.many) {
        dependent = other;
        principal = this.#entity;
      } else {
        dependent = this.#entity;
        principal = other;
      }

      const found = dependent.foreignKeys.find(
        fk => fk.targetName === principal.name && is(fk.names, navigation.foreignKeyNames)
      );

      if (
        !found &&
        navigation.foreignKeyNames.every(n => !!dependent.scalars.find(p => p.name === n))
      ) {
        const fk = new ForeignKeyModel(principal.name, navigation.foreignKeyNames);

        if (!this.#foreignKeys.has(dependent)) {
          this.#foreignKeys.set(dependent, List.of(fk));
        } else {
          this.#foreignKeys.get(dependent)!.push(fk);
        }
      }
    }

    return navigation;
  }
}

export class ColumnTypeFromProperties extends AbstractConvention {
  override visitStringProperty(stringProperty: StringPropertyModel) {
    if (!stringProperty.type && stringProperty.maxLength) {
      return stringProperty.withType(`varchar(${stringProperty.maxLength})`);
    }

    return stringProperty;
  }

  override visitIntProperty(intProperty: IntPropertyModel) {
    if (!intProperty.type) {
      return intProperty.withType("integer");
    }

    return intProperty;
  }

  override visitBooleanProperty(booleanProperty: BooleanPropertyModel) {
    if (!booleanProperty.type) {
      return booleanProperty.withType("boolean");
    }

    return booleanProperty;
  }

  override visitNumberProperty(numberProperty: NumberPropertyModel) {
    if (!numberProperty.type && numberProperty.precision && numberProperty.scale) {
      return numberProperty.withType(
        `numeric(${numberProperty.precision}, ${numberProperty.scale})`
      );
    }

    return numberProperty;
  }
}

export class PropertiesAreNotNullable extends AbstractConvention {
  override visitScalarProperty(scalarProperty: ScalarPropertyModel) {
    if (scalarProperty.nullable == undefined) {
      return scalarProperty.withNullable(false);
    }

    return scalarProperty;
  }
}

export class DateAsTimestampWithTimeZone extends AbstractConvention {
  override visitDateProperty(dateProperty: DatePropertyModel) {
    if (!dateProperty.type) {
      return dateProperty.withType("timestamp with time zone");
    }

    return dateProperty;
  }
}

export class DateAsTimestamp extends AbstractConvention {
  override visitDateProperty(dateProperty: DatePropertyModel) {
    if (!dateProperty.type) {
      return dateProperty.withType("timestamp");
    }

    return dateProperty;
  }
}

export class PrecisionScaleDefaults extends AbstractConvention {
  constructor(
    readonly precision = 18,
    readonly scale = 4
  ) {
    super();
  }

  override visitNumberProperty(numberProperty: NumberPropertyModel) {
    if (!numberProperty.precision) {
      numberProperty = numberProperty.withPrecision(this.precision);
    }

    if (!numberProperty.scale) {
      numberProperty = numberProperty.withScale(this.scale);
    }

    return numberProperty;
  }
}

export class MaxLengthDefault extends AbstractConvention {
  constructor(
    private readonly maxLength = 255,
    private readonly uuidLength = 36
  ) {
    super();
  }

  override visitStringProperty(stringProperty: StringPropertyModel) {
    if (!stringProperty.maxLength) {
      stringProperty = stringProperty.withMaxLength(
        stringProperty.type === "uuid" ? this.uuidLength : this.maxLength
      );
    }

    return stringProperty;
  }
}

export class UuidPropertyToBuffer extends AbstractConvention {
  override visitScalarProperty(scalarProperty: ScalarPropertyModel) {
    if (scalarProperty.type === "uuid" && !scalarProperty.convert) {
      return scalarProperty.withConvert(
        new ConversionModel({
          read: (v: any) => (Buffer.isBuffer(v as Buffer) ? stringify(v as Buffer) : v),
          write: (v: any) => (typeof v === "string" ? Buffer.from(parse(v)) : v),
        })
      );
    }

    return scalarProperty;
  }
}

const boolToOneOrZero = {
  read: (v: number | undefined) => (v === 1 ? true : v === 0 ? false : v),
  write: (v: boolean | undefined) => (v === true ? 1 : v === false ? 0 : v),
};

export class BooleansToOneOrZero extends AbstractConvention {
  override visitModel(model: Model) {
    model = super.visitModel(model);

    if (!model.conversion(Boolean)) {
      return model.withConversion(Boolean, new ConversionModel(boolToOneOrZero));
    }

    return model;
  }
}

export class DatePropertyToISOString extends AbstractConvention {
  override visitDateProperty(dateProperty: DatePropertyModel) {
    if (!dateProperty.convert && dateProperty.type === "timestamp") {
      return dateProperty.withConvert(
        new ConversionModel({
          read: (s: string) => (s ? new Date(s) : s),
          write: (d: Date) => (d ? d.toISOString() : d),
        })
      );
    }

    return dateProperty;
  }
}
