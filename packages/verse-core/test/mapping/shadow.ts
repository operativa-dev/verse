import { expect, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { boolean, entity, int, string, value, valueObject } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dbTest, fixture } from "../infra.js";

export class Customer {
  readonly id!: number;
  constructor(public name: string) {}
}

export class Address {
  constructor(
    readonly street: string,
    readonly city: string
  ) {}
}

const shadowModel = {
  entities: {
    customers: entity(
      Customer,
      {
        id: int(),
        name: string(),
        deleted: boolean({ generate: { default: false } }),
        address: value(Address, {
          street: string({ generate: { default: "Howick Ave" } }),
          city: string({ generate: { default: "Johannesburg" } }),
        }),
      },
      c => c.data(new Customer("Customer 1"))
    ),
  },
  values: [
    valueObject(Address, {
      street: string({ maxLength: 100 }),
      city: string(),
      country: string({ generate: { default: "South Africa" } }),
    }),
  ],
};

export const shadowFixture = (driver: Driver) => {
  return fixture(driver, shadowModel);
};

export const shadowTests = (verse: Verse<typeof shadowModel.entities>) => {
  dbTest(verse);

  test("add", async () => {
    const uow = verse.uow();
    const customer = new Customer("ACME Inc.");

    await uow.customers.add(customer);

    expect(customer.id).not.toBe(0);

    await uow.commit();

    expect(customer.id).toBe(2);

    const dbCustomer = await verse.from.customers
      .where((c, $id) => c.id === $id, customer.id)
      .single();

    expect(dbCustomer).toStrictEqual(customer);
  });

  test("update", async () => {
    const uow = verse.uow();
    const customer = await uow.customers.where(c => c.name === "Customer 1").single();

    uow.entry(customer)?.update({ deleted: true });

    await uow.commit();

    const dbCustomer = await verse.from.customers
      .where((c, $id) => c.id === $id, customer.id)
      .single();

    expect(dbCustomer).toBeDefined();
    expect((dbCustomer as any).deleted).toBe(true);
  });

  test("query", async () => {
    const uow = verse.uow();
    const customer = await uow.customers.where(c => (c as any).deleted).single();

    expect(customer).toBeDefined();
  });
};
