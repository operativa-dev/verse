import { describe, expect, test } from "vitest";
import { SingleTableInheritance } from "../../src/inheritance/sti.js";
import { entity, number, string } from "../../src/model/builder.js";
import { Model } from "../../src/model/model.js";
import { ModelValidator } from "../../src/model/validator.js";
import { modelOf } from "../infra.js";

describe("validations", () => {
  let $model: Model;

  class Entity {
    constructor(readonly p: number) {}
  }

  test("key undefined", () => {
    $model = modelOf(
      entity(Entity, {
        p: number(),
      })
    );

    expect(() => $model.accept(new ModelValidator(new SingleTableInheritance()))).toThrowError(
      "Entity 'Entity' does not have a key defined."
    );
  });

  test("key empty", () => {
    expect(() =>
      modelOf(
        entity(Entity, { b: string() }, a => {
          a.key();
        })
      )
    ).toThrowError("Argument 'key' cannot be empty!");
  });
});
