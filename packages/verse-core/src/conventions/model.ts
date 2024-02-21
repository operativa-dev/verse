import camelcase from "camelcase";
import pluralize from "pluralize";
import { ObjectNamePrefix } from "../model/builder.js";
import { EntityModel } from "../model/model.js";
import { AbstractConvention } from "./convention.js";

export class EntityNameFromLabel extends AbstractConvention {
  override visitEntity(entity: EntityModel) {
    if (entity.klass === Object && entity.name.startsWith(ObjectNamePrefix) && entity.label) {
      return entity.withName(camelcase(pluralize.singular(entity.label), { pascalCase: true }));
    }

    return entity;
  }
}
