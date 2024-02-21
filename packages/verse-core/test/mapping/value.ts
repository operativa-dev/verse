// noinspection JSConstantReassignment

import { beforeAll, expect, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { entity, int, string, value, valueObject } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dataTest, fixture } from "../infra.js";

export class Customer {
  readonly id!: number;

  constructor(
    readonly name: string,
    public address: Address,
    public shipTo: Address
  ) {}
}

export class Address {
  constructor(
    readonly street: string,
    readonly city: string
  ) {}
}

const valueModel = {
  entities: {
    customers: entity(Customer, {
      id: int(),
      name: string(),
      address: value(Address),
      shipTo: value(Address, a => {
        a.properties({
          street: string({ column: "ShipStreet" }),
          city: string({ column: "ShipCity" }),
        });
      }),
    }),
  },
  values: [
    valueObject(Address, a => {
      a.properties({
        street: string({ maxLength: 100 }),
        city: string(),
      });
    }),
  ],
};

export const valueFixture = (driver: Driver) => {
  return fixture(driver, valueModel);
};

export const valueTests = (verse: Verse<typeof valueModel.entities>) => {
  const snap = dataTest(verse);

  beforeAll(async () => {
    await verse.database.recreate();

    const uow = verse.uow();

    await uow.customers.add(
      new Customer(
        "John Snow",
        new Address("Castle Black", "The Wall"),
        new Address("Riverrun", "Riverlands")
      )
    );

    await uow.commit();
  });

  test("identity", async () => {
    const q = verse.from.customers;

    await snap(q);
  });

  test("project", async () => {
    const q = verse.from.customers.select(c => c.address);

    await snap(q);
  });

  test("project literal", async () => {
    const q = verse.from.customers.select(_ => new Address("Castle Black", "The Wall"));

    await snap(q);
  });

  test("project scalar", async () => {
    const q = verse.from.customers.select(c => c.address.city);

    await snap(q);
  });

  test("where value", async () => {
    const q = verse.from.customers.where(
      c => c.address === new Address("Castle Black", "The Wall")
    );

    await snap(q);
  });

  test("where value reversed", async () => {
    const q = verse.from.customers.where(
      c => new Address("Castle Black", "The Wall") === c.address
    );

    await snap(q);
  });

  test("where value null", async () => {
    const q = verse.from.customers.where(c => c.address === null);

    await snap(q);
  });

  test("where value null reverse", async () => {
    const q = verse.from.customers.where(c => null === c.address);

    await snap(q);
  });

  test("where value undefined", async () => {
    const q = verse.from.customers.where(c => c.address === undefined);

    await snap(q);
  });

  test("where value undefined reversed", async () => {
    const q = verse.from.customers.where(c => undefined === c.address);

    await snap(q);
  });

  test("where scalar", async () => {
    const q = verse.from.customers.where(c => c.address.city == "The Wall");

    await snap(q);
  });

  test("where scalar reversed", async () => {
    const q = verse.from.customers.where(c => "The Wall" === c.address.city);

    await snap(q);
  });

  test("where scalar null", async () => {
    const q = verse.from.customers.where(c => c.address.city === null);

    await snap(q);
  });

  test("update scalar noop", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.single();

    // @ts-ignore
    customer.address.street = "Winterfell";

    await uow.commit();

    const dbCustomer = await verse.from.customers.single();

    expect(dbCustomer.address.street).toBe("Castle Black");
    expect(dbCustomer.address.city).toBe("The Wall");
  });

  test("update", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.single();

    customer.address = new Address("Winterfell", "The North");

    await uow.commit();

    const dbCustomer = await verse.from.customers.single();

    expect(dbCustomer.address.street).toBe("Winterfell");
    expect(dbCustomer.address.city).toBe("The North");
  });
};
