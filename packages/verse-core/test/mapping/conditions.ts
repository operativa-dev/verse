import { beforeAll, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { boolean, entity, int, many, string } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dataTest, fixture } from "../infra.js";

export class Product {
  readonly id!: number;

  constructor(
    readonly name: string,
    readonly orders: Order[] = [],
    readonly deleted = false
  ) {}
}

export class Order {
  readonly id!: number;

  constructor(
    readonly quantity: number,
    readonly productId: number
  ) {}
}

const conditionsModel = {
  entities: {
    products: entity(
      Product,
      {
        id: int(),
        name: string(),
        deleted: boolean(),
        orders: many(Order),
      },
      p => {
        p.condition(p => !p.deleted, "soft delete");
      }
    ),
    orders: entity(
      Order,
      {
        id: int(),
        quantity: int(),
        productId: int(),
        deleted: boolean({ generate: { default: false } }),
      },
      o => o.condition(p => !p.deleted, "soft delete")
    ),
  },
};

export const conditionsFixture = (driver: Driver) => {
  return fixture(driver, conditionsModel);
};

export const conditionsTests = (verse: Verse<typeof conditionsModel.entities>) => {
  const snap = dataTest(verse);

  beforeAll(async () => {
    await verse.database.recreate();

    const uow = verse.uow();

    await uow.products.add(new Product("Bugatti Veyron"), new Product("Bugatti Chiron", [], true));

    await uow.commit();

    await uow.orders.add(new Order(5, 1));

    await uow.commit();
  });

  test("query all", async () => {
    const q = verse.from.products;

    await snap(q);
  });

  test("query where", async () => {
    const q = verse.from.products.where(p => p.name === "Bugatti Veyron");

    await snap(q);
  });

  test("query eager", async () => {
    const q = verse.from.products.with(p => p.orders);

    await snap(q);
  });

  test("disable all", async () => {
    const q = verse.from.products.options({ disabledConditions: "all" });

    await snap(q);
  });

  test("disable by name", async () => {
    const q = verse.from.products.options({ disabledConditions: ["soft delete"] });

    await snap(q);
  });
};
