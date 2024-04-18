// noinspection DuplicatedCode,JSUnusedGlobalSymbols

import { List } from "immutable";
import { afterEach, describe, expect, test } from "vitest";
import {
  ForeignKeyFromPrimaryKeyName,
  PrimaryKeyFromProperty,
} from "../../src/conventions/database.js";
import { ModelBinder } from "../../src/model/binder.js";
import { entity, int, many, one, string } from "../../src/model/builder.js";
import { Model } from "../../src/model/model.js";
import { modelOf, snap } from "../infra.js";

describe("key conventions", () => {
  test("id", () => {
    class Entity {
      other!: string;
      id!: number;
    }

    const model = entity(Entity, {
      other: string(),
      id: int(),
    });

    const newModel = new PrimaryKeyFromProperty().apply(model);

    expect(newModel.key?.names).toEqual(List.of(model.properties.get(1)!.name));
  });

  test("entity + id", () => {
    class Entity {
      other!: string;
      entityId!: number;
    }

    const model = entity(Entity, {
      other: string(),
      entityId: int(),
    });

    const newModel = new PrimaryKeyFromProperty().apply(model);

    expect(newModel.key?.names).toEqual(List.of(model.properties.get(1)!.name));
  });

  test("not found", () => {
    class Entity {
      other!: string;
      id1!: number;
    }

    const model = entity(Entity, {
      other: string(),
      id1: int(),
    });

    const newModel = new PrimaryKeyFromProperty().apply(model);

    expect(newModel.key?.properties).toBeUndefined();
  });

  test("configured", () => {
    class Entity {
      other!: string;
      entityId!: number;
      opt?: number;
    }

    const model = entity(
      Entity,
      {
        other: string(),
        entityId: int(),
      },
      e => {
        e.key("other", "entityId");
      }
    );

    const newModel = new PrimaryKeyFromProperty().apply(model);

    expect(newModel.key?.names).toEqual(model.key?.names);
  });
});

let $model: Model;

describe("foreign key conventions", () => {
  afterEach(async ctx => {
    await snap(ctx, new ModelBinder().bind($model).toJSON(), "json");
  });

  test("exact match many navigation", () => {
    class A {
      aKey!: number;
      bs!: B[];
    }

    class B {
      id!: number;
      aKey!: number;
    }

    const model = modelOf(
      entity(
        A,
        {
          aKey: int(),
          bs: many(B),
        },
        a => {
          a.key("aKey");
        }
      ),
      entity(
        B,
        {
          id: int(),
          aKey: int(),
        },
        b => {
          b.key("id");
        }
      )
    );

    $model = new ForeignKeyFromPrimaryKeyName().apply(model);
  });

  test("exact match bidirectional navigations", () => {
    class A {
      aKey!: number;
      bs!: B[];
    }

    class B {
      id!: number;
      aKey!: number;
      a!: A;
    }

    const model = modelOf(
      entity(
        A,
        {
          aKey: int(),
          bs: many(B),
        },
        a => {
          a.key("aKey");
        }
      ),
      entity(
        B,
        {
          id: int(),
          aKey: int(),
          a: one(A),
        },
        b => {
          b.key("id");
        }
      )
    );

    $model = new ForeignKeyFromPrimaryKeyName().apply(model);
  });

  test("exact match one navigation", () => {
    class A {
      aKey!: number;
    }

    class B {
      id!: number;
      aKey!: number;
      a!: A;
    }

    const model = modelOf(
      entity(
        A,
        {
          aKey: int(),
        },
        a => {
          a.key("aKey");
        }
      ),
      entity(
        B,
        {
          id: int(),
          aKey: int(),
          a: one("A"),
        },
        b => {
          b.key("id");
        }
      )
    );

    $model = new ForeignKeyFromPrimaryKeyName().apply(model);
  });

  test("fk no navigation", () => {
    class A {
      aKey!: number;
    }

    class B {
      id!: number;
      aKey!: number;
    }

    const model = modelOf(
      entity(
        A,
        {
          aKey: int(),
        },
        a => {
          a.key("aKey");
        }
      ),
      entity(
        B,
        {
          id: int(),
          aKey: int(),
        },
        b => {
          b.key("id");
          b.references("A");
        }
      )
    );

    $model = new ForeignKeyFromPrimaryKeyName().apply(model);
  });
});
