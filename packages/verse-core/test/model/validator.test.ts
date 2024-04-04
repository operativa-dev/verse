import { describe, expect, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { SingleTableInheritance } from "../../src/inheritance/sti.js";
import { entity, int, number, string } from "../../src/model/builder.js";
import { Model } from "../../src/model/model.js";
import { ModelValidator } from "../../src/model/validator.js";
import { verse } from "../../src/verse.js";
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

export const seqhiloFixture = (driver: Driver) => {
  return verse({
    config: {
      driver,
    },
    model: {
      entities: {
        todos: entity({
          id: int({ generate: { using: "seqhilo", sequence: "boo" } }),
          title: string(),
        }),
      },
    },
  });
};
