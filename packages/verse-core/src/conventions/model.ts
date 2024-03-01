import camelcase from "camelcase";
import pluralize from "pluralize";
import { ObjectNamePrefix } from "../model/builder.js";
import {
  AbstractModel,
  EntityModel,
  ForeignKeyModel,
  NavigationPropertyModel,
} from "../model/model.js";
import { ModelRewriter } from "../model/rewriter.js";
import { Convention } from "./convention.js";

export class EntityNameFromLabel implements Convention {
  apply<TModel extends AbstractModel>(model: TModel) {
    const renamer = new Renamer();

    return model.accept(renamer).accept(new ReferenceUpdater(renamer.changed)) as TModel;
  }
}

class Renamer extends ModelRewriter {
  readonly changed: Map<string, string> = new Map();

  override visitEntity(entity: EntityModel) {
    if (entity.klass === Object && entity.name.startsWith(ObjectNamePrefix) && entity.label) {
      const name = camelcase(pluralize.singular(entity.label), { pascalCase: true });

      this.changed.set(entity.name, name);

      return entity.withName(name);
    }

    return entity;
  }
}

class ReferenceUpdater extends ModelRewriter {
  constructor(private readonly changed: Map<string, string>) {
    super();
  }

  override visitForeignKey(foreignKey: ForeignKeyModel) {
    const newName = this.changed.get(foreignKey.targetName);

    if (newName) {
      return foreignKey.withTargetName(newName);
    }

    return foreignKey;
  }

  override visitNavigationProperty(navigation: NavigationPropertyModel) {
    const newName = this.changed.get(navigation.targetName);

    if (newName) {
      return navigation.withTargetName(newName);
    }

    return navigation;
  }
}
