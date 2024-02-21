import { List } from "immutable";
import {
  __parent,
  AbstractModel,
  ConcurrencyModel,
  EntityModel,
  ForeignKeyModel,
  KeyModel,
  Model,
  NavigationPropertyModel,
  ScalarPropertyModel,
  SequenceModel,
  ValueObjectModel,
  ValueObjectPropertyModel,
} from "./model.js";
import { ModelVisitor } from "./visitor.js";

export class ModelBinder extends ModelVisitor<void> {
  bind(model: Model) {
    model = model.withEntities(this.#sort(model));

    model.accept(this);

    return model;
  }

  #sort(model: Model): List<EntityModel> {
    const result: EntityModel[] = [];
    const visited = new Set<string>();
    const path = new Array<string>();

    function dfs(entity: EntityModel) {
      visited.add(entity.name);
      path.push(entity.name);

      entity.foreignKeys?.forEach(fk => {
        if (path.includes(fk.targetName)) {
          path.push(fk.targetName);
          throw new Error(`Circular foreign keys detected! '${path.join(" -> ")}'.`);
        }

        if (!visited.has(fk.targetName)) {
          dfs(model.entity(fk.targetName));
        }
      });

      result.push(entity);
      path.pop();
    }

    model.entities.forEach(e => {
      if (!visited.has(e.name)) {
        dfs(e);
      }
    });

    return List(result);
  }

  #scope!: AbstractModel;

  override visitModel(model: Model) {
    this.#scope = model;

    model.entities.forEach(e => e.accept(this));
    model.values.forEach(e => e.accept(this));
    model.sequences.forEach(s => s.accept(this));
  }

  override visitEntity(entity: EntityModel) {
    entity[__parent](this.#scope);

    const oldScope = this.#scope;

    this.#scope = entity;

    entity.key?.accept(this);
    entity.foreignKeys?.forEach(fk => fk.accept(this));
    entity.properties?.forEach(p => p.accept(this));
    entity.concurrency?.accept(this);

    this.#scope = oldScope;
  }

  override visitValueObject(valueObject: ValueObjectModel) {
    valueObject[__parent](this.#scope);

    const oldScope = this.#scope;

    this.#scope = valueObject;

    valueObject.properties?.forEach(p => p.accept(this));

    this.#scope = oldScope;
  }

  override visitSequence(sequence: SequenceModel) {
    sequence[__parent](this.#scope);
  }

  override visitKey(key: KeyModel) {
    key[__parent](this.#scope);
  }

  override visitForeignKey(foreignKey: ForeignKeyModel) {
    foreignKey[__parent](this.#scope);
  }

  override visitConcurrency(concurrency: ConcurrencyModel) {
    concurrency[__parent](this.#scope);
  }

  override visitScalarProperty(scalarProperty: ScalarPropertyModel) {
    scalarProperty[__parent](this.#scope);
  }

  override visitValueObjectProperty(valueObjectProperty: ValueObjectPropertyModel) {
    valueObjectProperty[__parent](this.#scope);
  }

  override visitNavigationProperty(navigation: NavigationPropertyModel) {
    navigation[__parent](this.#scope);
  }
}
