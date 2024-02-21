import { TYPE_CONDITION } from "../conventions/database.js";
import { InheritanceStrategy } from "../inheritance/strategy.js";
import { error } from "../utils/utils.js";
import {
  Condition,
  EntityModel,
  ForeignKeyModel,
  Model,
  NavigationPropertyModel,
  ScalarPropertyModel,
} from "./model.js";
import { ModelVisitor } from "./visitor.js";

export class ModelValidator extends ModelVisitor<void> {
  constructor(private readonly inheritance: InheritanceStrategy) {
    super();
  }

  override visitModel(model: Model) {
    model.entities.forEach(e => e.accept(this));
    model.sequences.forEach(s => s.accept(this));
  }

  override visitEntity(entity: EntityModel) {
    if (!entity.key || entity.key.properties.isEmpty()) {
      throw new Error(`Entity '${entity.name}' does not have a key defined.`);
    }

    if (!entity.label) {
      throw new Error(`Entity '${entity.name}' does not have a label defined.`);
    }

    if (!entity.table) {
      throw new Error(`Entity '${entity.name}' does not have a table defined.`);
    }

    let typeCondition: Condition | undefined;

    if (
      (entity.base || !entity.derived.isEmpty()) &&
      !(typeCondition = entity.conditions.find(c => c.name === TYPE_CONDITION))
    ) {
      throw new Error(`Entity '${entity.name}' does not have a type condition defined.`);
    }

    if (typeCondition && typeof typeCondition.condition !== "string") {
      throw new Error(`Type condition of entity '${entity.name}' must be a string.`);
    }

    entity.properties.forEach(p => p.accept(this));
    entity.foreignKeys.forEach(fk => fk.accept(this));

    this?.inheritance.validate(entity);
  }

  override visitForeignKey(foreignKey: ForeignKeyModel) {
    if ((foreignKey.names?.size ?? 0) == 0) {
      error(
        `Foreign key from entity '${foreignKey.parent.name}' to entity 
        '${foreignKey.references.name}' does not have any properties defined.`
      );
    }
  }

  override visitNavigationProperty(navigation: NavigationPropertyModel) {
    if (!navigation.foreignKeyNames) {
      error(
        `Navigation property '${navigation.name}' of entity '${navigation.parent.name}' 
         does not have a foreign key defined.`
      );
    }
  }

  override visitScalarProperty(scalarProperty: ScalarPropertyModel) {
    if (scalarProperty.generate) {
      if (scalarProperty.generate.using === "seqhilo") {
        if (!scalarProperty.generate.sequence) {
          throw new Error(
            `Scalar property '${scalarProperty.name}' does not have a sequence name defined.`
          );
        }
      }
    }

    if (!scalarProperty.column) {
      throw new Error(`Scalar property '${scalarProperty.name}' does not have a column defined.`);
    }
  }
}
