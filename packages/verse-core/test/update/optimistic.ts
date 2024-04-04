// noinspection JSConstantReassignment,DuplicatedCode

import { expect, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { entity, int, number, string } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dbTest, fixture } from "../infra.js";

export class Customer {
  constructor(
    readonly id: number,
    public name: string
  ) {}
}

export class Order {
  readonly token!: number;

  constructor(
    readonly id: string,
    public amount: number
  ) {}
}

const optimisticModel = {
  customers: entity(Customer, {
    id: int({ generate: { using: "none" } }),
    name: string(),
    version: int({ column: "_version" }),
  }),

  orders: entity(
    Order,
    {
      id: string(),
      amount: number(),
      token: int({ generate: { default: 9 } }),
    },
    o => {
      o.concurrency({ version: "token" });
    }
  ),

  products: entity({
    id: int(),
    name: string(),
  }),
};

export const optimisticFixture = (driver: Driver) => {
  return fixture(driver, optimisticModel);
};

export const optimisticTests = (verse: Verse<typeof optimisticModel>) => {
  dbTest(verse);

  test("rows affected update", async () => {
    const uow = verse.uow();

    const customer = new Customer(2, "Non-existent customer");
    await uow.add(customer);

    uow.entry(customer)?.setState("modified");

    await expect(() => uow.commit()).rejects.toThrow(
      "Concurrency Error - 0 rows affected. Either the row has been deleted, or a concurrency violation was detected."
    );
  });

  test("rows affected delete", async () => {
    const uow = verse.uow();

    const customer = new Customer(3, "Non-existent customer");
    await uow.add(customer);

    uow.entry(customer)?.setState("removed");

    await expect(() => uow.commit()).rejects.toThrow(
      "Concurrency Error - 0 rows affected. Either the row has been deleted, or a concurrency violation was detected."
    );
  });

  test("version update", async () => {
    const uow = verse.uow();

    await uow.add(new Customer(41, "Existing customer"));
    await uow.commit("read uncommitted");

    const customer = await uow.customers.where(c => c.id === 41).single();

    expect(customer).toBeDefined();

    customer.name = "Updated customer";

    await uow.commit();

    // @ts-ignore
    expect(customer.version).toBe(2);

    const dbCustomer = await verse
      .uow()
      .customers.where(c => c.id === 41)
      .single();

    expect(dbCustomer).toBeDefined();
    expect(dbCustomer.name).toBe("Updated customer");

    // @ts-ignore
    expect(dbCustomer.version).toBe(2);
  });

  test("version mismatch", async () => {
    const uow1 = verse.uow();

    await uow1.add(new Customer(42, "Existing customer 2"));
    await uow1.commit("serializable");

    const customer1 = await uow1.customers.where(c => c.id === 42).single();
    customer1.name = "Updated customer again";

    const uow2 = verse.uow();

    const customer2 = await uow2.customers.where(c => c.id === 42).single();

    expect(customer1).not.toBe(customer2);

    await uow1.commit();

    customer2.name = "Updated customer yet again";

    await expect(() => uow2.commit()).rejects.toThrow(
      "Concurrency Error - 0 rows affected. Either the row has been deleted, or a concurrency violation was detected."
    );
  });

  test("version mismatch token", async () => {
    const uow1 = verse.uow();

    await uow1.add(new Order("42", 123.45));
    await uow1.commit("read committed");

    const order1 = await uow1.orders.where(c => c.id === "42").single();
    order1.amount = 456.78;

    const uow2 = verse.uow();

    const order2 = await uow2.orders.where(c => c.id === "42").single();

    expect(order1).not.toBe(order2);

    await uow1.commit();

    order2.amount = 567.89;

    await expect(() => uow2.commit()).rejects.toThrow(
      "Concurrency Error - 0 rows affected. Either the row has been deleted, or a concurrency violation was detected."
    );
  });

  test("version mismatch rollback", async () => {
    const uow1 = verse.uow();

    await uow1.add(new Customer(49, "Existing customer 2"));
    await uow1.commit();

    const customer1 = await uow1.customers.where(c => c.id === 49).single();
    customer1.name = "Updated customer again";

    const uow2 = verse.uow();

    const customer2 = await uow2.customers.where(c => c.id === 49).single();

    expect(customer1).not.toBe(customer2);

    await uow1.commit();

    customer2.name = "Updated customer yet again";

    const product = { name: "Product 1" };

    await uow2.products.add(product);

    // @ts-ignore
    expect(product.id).toBe(-1);

    await expect(() => uow2.commit()).rejects.toThrow(
      "Concurrency Error - 0 rows affected. Either the row has been deleted, or a concurrency violation was detected."
    );

    // @ts-ignore
    expect(product.id).toBe(-1);
  });
};
