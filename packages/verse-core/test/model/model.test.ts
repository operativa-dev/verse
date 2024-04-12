// noinspection DuplicatedCode

import { List } from "immutable";
import { afterEach, describe, expect, test } from "vitest";
import {
  boolean,
  entity,
  int,
  many,
  number,
  string,
  value,
  valueObject,
} from "../../src/model/builder.js";
import { Model } from "../../src/model/model.js";
import { boundModelOf, modelOf, snap } from "../infra.js";

describe("binder", () => {
  class A {
    id!: number;
  }

  class B {
    id!: number;
  }

  class C {
    id!: number;
  }

  const entityA = () =>
    entity(A, {
      id: int(),
    });

  const entityB = () =>
    entity(
      B,
      {
        id: int(),
      },
      b => {
        b.references("A", "id");
      }
    );

  const entityC = () =>
    entity(
      C,
      {
        id: int(),
      },
      c => {
        c.references(B, "id");
        c.references(A, "id");
      }
    );

  test("sort 1", () => {
    const model = boundModelOf(entityA(), entityB(), entityC());

    expect(model.entities.map(e => e.name)).toEqual(List.of("A", "B", "C"));

    const a = model.entity(A);
    const b = model.entity(B);
    const c = model.entity(C);

    expect(b.foreignKeys?.get(0)?.references).toBe(a);
    expect(c.foreignKeys?.get(0)?.references).toBe(b);
  });

  test("sort 2", () => {
    const model = boundModelOf(entityB(), entityC(), entityA());

    expect(model.entities.map(e => e.name)).toEqual(List.of("A", "B", "C"));

    const a = model.entity(A);
    const b = model.entity(B);
    const c = model.entity(C);

    expect(b.foreignKeys?.get(0)?.references).toBe(a);
    expect(c.foreignKeys?.get(0)?.references).toBe(b);
  });

  test("sort 3", () => {
    const model = boundModelOf(entityC(), entityB(), entityA());

    expect(model.entities.map(e => e.name)).toEqual(List.of("A", "B", "C"));

    const a = model.entity(A);
    const b = model.entity(B);
    const c = model.entity(C);

    expect(b.foreignKeys?.get(0)?.references).toBe(a);
    expect(c.foreignKeys?.get(0)?.references).toBe(b);
  });

  test("circular", () => {
    expect(() =>
      boundModelOf(
        entity(
          A,
          {
            id: int(),
          },
          a => {
            a.references(C, "id");
          }
        ),
        entityB(),
        entityC()
      )
    ).toThrow("Circular foreign keys detected! 'A -> C -> B -> A'.");
  });
});

describe("navigations", () => {
  let $model: Model;

  afterEach(async ctx => {
    await snap(ctx, $model.toJSON(), "json");
  });

  class Customer {
    id!: number;
    orders!: Order[];
  }

  class Order {
    id!: number;
    customerId!: number;
  }

  const customer = entity(
    Customer,
    {
      id: int(),
      orders: many(Order),
    },
    a => {
      a.key("id");
    }
  );

  const order = entity(
    Order,
    {
      id: int(),
      customerId: int(),
    },
    b => {
      b.key("id");
      b.references(Customer, "customerId");
    }
  );

  test("model", () => {
    $model = boundModelOf(customer, order);
  });
});

describe("value objects", () => {
  let $model: Model;

  afterEach(async ctx => {
    await snap(ctx, $model.toJSON(), "json");
  });

  class Customer {
    id!: number;
    address!: Address;
  }

  class Address {
    street!: string;
  }

  const customer = entity(Customer, {
    id: int(),
    address: value(Address),
  });

  const address = valueObject(Address, {
    street: string(),
  });

  test("model", () => {
    $model = boundModelOf(customer, address);
  });
});

describe("inheritance", () => {
  let $model: Model;

  afterEach(async ctx => {
    await snap(ctx, $model.toJSON(), "json");
  });

  class Customer {
    id!: number;
  }

  class GoldCustomer extends Customer {
    rewards!: number;
  }

  const customer = entity(Customer, {
    id: int(),
  });

  const goldCustomer = entity(GoldCustomer, {
    rewards: number(),
  });

  test("model", () => {
    $model = boundModelOf(customer, goldCustomer);
  });
});

describe("printing", () => {
  let $model: Model;

  afterEach(async ctx => {
    await snap(ctx, $model.toJSON(), "json");
  });

  class PrintMe {
    constructor(
      readonly n1: number,
      readonly n2: number,
      readonly s1: string,
      readonly s2: string,
      readonly s3: string,
      readonly i: number
    ) {}
  }

  test("property facets", () => {
    $model = modelOf(
      entity(PrintMe, {
        n1: number({ precision: 10, scale: 2 }),
        n2: number(),
        s1: string({ nullable: false }),
        s2: string({ maxLength: 42 }),
        s3: string({ type: "text" }),
        i: int({ column: "foo" }),
      })
    );
  });
});

describe("shadow properties", () => {
  let $model: Model;

  afterEach(async ctx => {
    await snap(ctx, $model.toJSON(), "json");
  });

  class Customer {
    id!: number;
    name!: string;
  }

  const customer = entity(Customer, {
    id: int(),
    name: string(),
    deleted: boolean(),
  });

  test("model", () => {
    $model = boundModelOf(customer);
  });
});
