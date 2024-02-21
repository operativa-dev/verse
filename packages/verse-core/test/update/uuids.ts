// noinspection JSConstantReassignment,DuplicatedCode

import { validate } from "uuid";
import { expect, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { entity, string } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dbTest, fixture } from "../infra.js";

export class Customer {
  readonly id!: string;
  constructor(public name: string) {}
}

const uuidModel = {
  customers: entity(
    Customer,
    {
      id: string({ type: "uuid", generate: { using: "uuid" } }),
      name: string(),
    },
    c => c.data(new Customer("Customer 1"), new Customer("Customer 2"), new Customer("Customer 3"))
  ),
};

export const uuidFixture = (driver: Driver) => {
  return fixture(driver, uuidModel);
};

export const uuidTests = (verse: Verse<typeof uuidModel>) => {
  dbTest(verse);

  test("simple add", async () => {
    const uow = verse.uow();
    const customer = new Customer("ACME Inc.");

    await uow.customers.add(customer);

    expect(validate(customer.id)).toBeTruthy();

    await uow.commit();

    const dbCustomer = await verse.from.customers
      .where((c, $id) => c.id === $id, customer.id)
      .single();

    expect(dbCustomer).toBeDefined();
    expect(dbCustomer!.id.toLowerCase()).toBe(customer.id);
    expect(dbCustomer!.name).toBe("ACME Inc.");
  });

  test("simple update", async () => {
    const uow = verse.uow();
    const customer = await uow.customers.where(c => c.name === "Customer 2").single();

    customer.name = "Customer 2b";

    await uow.commit();

    const dbCustomer = await verse.from.customers
      .where((c, $id) => c.id === $id, customer.id)
      .single();

    expect(dbCustomer).toBeDefined();
    expect(dbCustomer!.name).toBe("Customer 2b");
  });

  test("simple delete", async () => {
    const uow = verse.uow();
    const customer = await uow.customers.where(c => c.name === "Customer 1").single();

    expect(customer).toBeDefined();
    expect(uow.entry(customer)).toBeDefined();

    uow.customers.remove(customer);

    await uow.commit();

    const dbCustomer = await verse.from.customers
      .where((c, $id) => c.id === $id, customer.id)
      .maybeSingle();

    expect(dbCustomer).toBeUndefined();
    expect(uow.entry(customer)).toBeUndefined();
  });
};
