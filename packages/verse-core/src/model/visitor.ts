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
  ValueObjectModel,
  ValueObjectPropertyModel,
} from "./model.js";

/**
 * Implements the visitor pattern for models.
 *
 * @template T - The return type of visit methods.
 * @template S - The type of additional state that can be passed to visit methods.
 */
export class ModelVisitor<T, S = unknown> {
  // @ts-ignore
  visitModel(model: Model, state?: S) {
    return undefined as T;
  }

  // @ts-ignore
  visitEntity(entity: EntityModel, state?: S) {
    return undefined as T;
  }

  // @ts-ignore
  visitValueObject(valueObject: ValueObjectModel, state?: S) {
    return undefined as T;
  }

  // @ts-ignore
  visitSequence(sequence: SequenceModel, state?: S) {
    return undefined as T;
  }

  // @ts-ignore
  visitKey(key: KeyModel, state?: S) {
    return undefined as T;
  }

  // @ts-ignore
  visitForeignKey(foreignKey: ForeignKeyModel, state?: S) {
    return undefined as T;
  }

  // @ts-ignore
  visitConcurrency(concurrency: ConcurrencyModel, state?: S) {
    return undefined as T;
  }

  // @ts-ignore
  visitScalarProperty(scalarProperty: ScalarPropertyModel, state?: S) {
    return undefined as T;
  }

  // @ts-ignore
  visitStringProperty(stringProperty: StringPropertyModel, state?: S) {
    return this.visitScalarProperty(stringProperty);
  }

  // @ts-ignore
  visitIntProperty(intProperty: IntPropertyModel, state?: S) {
    return this.visitScalarProperty(intProperty);
  }

  // @ts-ignore
  visitBooleanProperty(booleanProperty: BooleanPropertyModel, state?: S) {
    return this.visitScalarProperty(booleanProperty);
  }

  // @ts-ignore
  visitDateProperty(dateProperty: DatePropertyModel, state?: S) {
    return this.visitScalarProperty(dateProperty);
  }

  // @ts-ignore
  visitNumberProperty(numberProperty: NumberPropertyModel, state?: S) {
    return this.visitScalarProperty(numberProperty);
  }

  // @ts-ignore
  visitNavigationProperty(navigation: NavigationPropertyModel, state?: S) {
    return undefined as T;
  }

  // @ts-ignore
  visitValueObjectProperty(valueObjectProperty: ValueObjectPropertyModel, state?: S) {
    return undefined as T;
  }

  // @ts-ignore
  visitGenerator(generator: GeneratorModel, state?: S) {
    return undefined as T;
  }

  // @ts-ignore
  visitConversion(conversion: ConversionModel, state?: S) {
    return undefined as T;
  }
}
