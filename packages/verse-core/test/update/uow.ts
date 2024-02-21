// noinspection JSConstantReassignment

import { expect, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { entity, int, string } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dbTest, fixture } from "../infra.js";

export class Customer {
  readonly id!: number;
  constructor(public name: string) {}
}

const uowModel = {
  customers: entity(
    Customer,
    {
      id: int(),
      name: string(),
    },
    c => c.data(new Customer("Customer 1"), new Customer("Customer 2"), new Customer("Customer 3"))
  ),
};

export const uowFixture = (driver: Driver) => {
  return fixture(driver, uowModel);
};

export const uowTests = (verse: Verse<typeof uowModel>) => {
  dbTest(verse);

  test("simple add", async () => {
    const uow = verse.uow();
    const customer = new Customer("ACME Inc.");

    await uow.customers.add(customer);

    expect(customer.id).not.toBe(0);

    await uow.commit();

    expect(customer.id).toBe(4);

    const dbCustomer = await verse.from.customers
      .where((c, $id) => c.id === $id, customer.id)
      .single();

    expect(dbCustomer).toStrictEqual(customer);

    const uowCustomer = await uow.customers.where((c, $id) => c.id === $id, customer.id).first();

    expect(uow.entry(uowCustomer)).toBeDefined();
  });

  test("add then update", async () => {
    const uow = verse.uow();
    const customer = new Customer("MSFT");

    await uow.customers.add(customer);

    await uow.commit();

    customer.name = "Microsoft";

    await uow.commit();

    const dbCustomer = await verse.from.customers
      .where((c, $id) => c.id === $id, customer.id)
      .single();

    expect(dbCustomer).toBeDefined();
    expect(dbCustomer!.name).toBe("Microsoft");
  });

  test("simple update", async () => {
    const uow = verse.uow();
    const customer = await uow.customers.where(c => c.name === "Customer 2").single();

    customer.name = "Customer 2 Updated";

    await uow.commit();

    const dbCustomer = await verse.from.customers
      .where((c, $id) => c.id === $id, customer.id)
      .single();

    expect(dbCustomer).toBeDefined();
    expect(dbCustomer!.name).toBe("Customer 2 Updated");
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

  test("add existing throws", async () => {
    const uow = verse.uow();
    const customer = await uow.customers.where(c => c.name === "Customer 3").single();

    await expect(async () => await uow.customers.add(customer)).rejects.toThrow(
      "Entity of type 'Customer' already tracked in this unit of work with state 'unchanged'."
    );
  });

  test("compiled tracked query", async () => {
    const q = verse.compileUow((from, $name: string) =>
      from.customers.where(c => c.name === $name).single()
    );

    const uow = verse.uow();

    const customer = await q(uow, "Customer 3");

    expect(customer).toBeDefined();
    expect(uow.entry(customer)).toBeDefined();
  });
};

export class NonKeyIdentity {
  readonly id!: number;
  readonly nonKey!: number;
}

const nonKeyIdentityModel = {
  nonKeyIdentity: entity(NonKeyIdentity, {
    id: int(),
    nonKey: int({ generate: { using: "identity" } }),
  }),
};

export const nonKeyIdentityFixture = (driver: Driver) => {
  return fixture(driver, nonKeyIdentityModel);
};

export const nonKeyIdentityTests = (verse: Verse<typeof nonKeyIdentityModel>) => {
  dbTest(verse);

  test("non key identity", async () => {
    const uow = verse.uow();
    const nonKeyIdentity = new NonKeyIdentity();

    expect(nonKeyIdentity.nonKey).toBeUndefined();

    await uow.nonKeyIdentity.add(nonKeyIdentity);
    await uow.commit();

    expect(nonKeyIdentity.nonKey).toBe(1);

    const dbNonKeyIdentity = await verse.from.nonKeyIdentity
      .where((nk, $id) => nk.id === $id, nonKeyIdentity.id)
      .single();

    expect(dbNonKeyIdentity).toStrictEqual(nonKeyIdentity);
  });
};

export class MixedKey {
  readonly id!: number;
  constructor(readonly other: string) {}
}

const mixedKeyModel = {
  mixedKeys: entity(
    MixedKey,
    {
      id: int({ generate: { using: "identity" } }),
      other: string(),
    },
    c => {
      c.key("id", "other");
    }
  ),
};

export const mixedKeyFixture = (driver: Driver) => {
  return fixture(driver, mixedKeyModel);
};

export const mixedKeyTests = (verse: Verse<typeof mixedKeyModel>) => {
  dbTest(verse);

  test("add mixed key", async () => {
    const uow = verse.uow();
    const mixedKey = new MixedKey("foo");

    await uow.mixedKeys.add(mixedKey);

    expect(mixedKey.id).not.toBe(0);

    await uow.commit();

    expect(mixedKey.id).toBe(1);

    const dbMixedKey = await verse.from.mixedKeys
      .where((c, $id) => c.id === $id && c.other === "foo", mixedKey.id)
      .single();

    expect(dbMixedKey).toStrictEqual(mixedKey);

    const uowMixedKey = await uow.mixedKeys
      .where((c, $id) => c.id === $id && c.other === "foo", mixedKey.id)
      .first();

    expect(uow.entry(uowMixedKey)).toBeDefined();
  });
};
