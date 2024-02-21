import { List } from "immutable";
import { SchemaGenerator } from "../db/schema.js";
import { SqlNode } from "../db/sql.js";
import { EntityModel, PropertyModel, ScalarPropertyPath, StructuralModel } from "../model/model.js";

/**
 * A strategy for handling inheritance mapping in the database.
 */
export interface InheritanceStrategy {
  queryableProperties(entity: StructuralModel): List<PropertyModel>;
  updatableProperties(entity: EntityModel): List<ScalarPropertyPath>;
  validate(entity: EntityModel): void;
  schema(entity: EntityModel, generator: SchemaGenerator): SqlNode | undefined;
}
