import { List } from "immutable";
import {
  AbstractModel,
  EntityModel,
  ForeignKeyModel,
  KeyModel,
  Model,
  NavigationPropertyModel,
  ScalarPropertyModel,
  ValueObjectModel,
  ValueObjectPropertyModel,
} from "./model.js";
import { ModelVisitor } from "./visitor.js";

/**
 * A {@link ModelVisitor} for persistently rewriting models.
 * This class provides methods for visiting different types of model nodes and rewriting them.
 */
export class ModelRewriter extends ModelVisitor<AbstractModel> {
  override visitModel(model: Model) {
    return model.rewrite(this);
  }

  override visitEntity(entity: EntityModel) {
    return entity.rewrite(this);
  }

  override visitValueObject(valueObject: ValueObjectModel) {
    return valueObject.rewrite(this);
  }

  override visitKey(key: KeyModel) {
    return key.rewrite(this);
  }

  override visitForeignKey(foreignKey: ForeignKeyModel) {
    return foreignKey.rewrite(this);
  }

  override visitScalarProperty(scalarProperty: ScalarPropertyModel) {
    return scalarProperty.rewrite(this);
  }

  override visitNavigationProperty(navigation: NavigationPropertyModel) {
    return navigation.rewrite(this);
  }

  override visitValueObjectProperty(valueObjectProperty: ValueObjectPropertyModel) {
    return valueObjectProperty.rewrite(this);
  }

  rewriteList<T extends AbstractModel>(list: List<T>) {
    return list.withMutations(mutable => {
      for (let i = 0; i < mutable.size; i++) {
        const item = mutable.get(i)!;
        const newItem = item.accept(this);
        if (newItem !== item) {
          mutable.set(i, newItem as T);
        }
      }
    });
  }
}
