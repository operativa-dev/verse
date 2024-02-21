import { List } from "immutable";
import { SchemaGenerator } from "../db/schema.js";
import { SqlColumn, SqlCreateTable, SqlForeignKey, sqlId } from "../db/sql.js";
import { EntityModel, PropertyModel, ScalarPropertyPath, StructuralModel } from "../model/model.js";
import { InheritanceStrategy } from "./strategy.js";

export class SingleTableInheritance implements InheritanceStrategy {
  updatableProperties(entity: EntityModel): List<ScalarPropertyPath> {
    return (
      entity.base ? this.updatableProperties(entity.base) : List<ScalarPropertyPath>()
    ).concat(entity.scalarFlatMap());
  }

  queryableProperties(model: StructuralModel): List<PropertyModel> {
    if (model instanceof EntityModel) {
      const properties: PropertyModel[] = [];

      let base = model.base;

      while (base) {
        properties.unshift(...base.scalarsAndValues);
        base = base.base;
      }

      properties.push(...model.scalarsAndValues);
      properties.push(...this.#derivedProperties(model));

      return List(properties);
    }

    return model.properties;
  }

  #derivedProperties(entity: EntityModel): List<PropertyModel> {
    return entity.derived.flatMap(e => {
      return e.scalarsAndValues.concat(this.#derivedProperties(e));
    });
  }

  validate(entity: EntityModel) {
    if (!entity.isRoot && entity.table && entity.table !== entity.root.table) {
      throw new Error(
        `Entity '${entity.name}' cannot map to table '${entity.table}'. ` +
          `All entities in the hierarchy must map to table '${entity.root.table}'.`
      );
    }
  }

  schema(entity: EntityModel, generator: SchemaGenerator) {
    if (!entity.isRoot) {
      return undefined;
    }

    return new SqlCreateTable(
      sqlId(entity.table!),
      this.#columns(entity, generator),
      entity.key?.properties.map(p => sqlId(p.column!)),
      entity.foreignKeys?.map(fk => fk.accept(generator) as SqlForeignKey)
    );
  }

  #columns(entity: EntityModel, generator: SchemaGenerator): List<SqlColumn> {
    return entity
      .scalarFlatMap(({ scalar }) => scalar.accept(generator) as SqlColumn)
      .concat(
        entity.derived.flatMap(e => {
          return this.#columns(e, generator).map(c => c.withNullable(true));
        })
      );
  }
}
