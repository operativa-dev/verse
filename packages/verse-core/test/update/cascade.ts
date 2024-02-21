import { expect, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { entity, int, many, one, string } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dbTest, fixture } from "../infra.js";

export class Customer {
  constructor(
    public name: string,
    readonly cid?: number,
    readonly orders: Order[] = []
  ) {}
}

export class Order {
  constructor(
    public customerId: number,
    public productId: number,
    readonly oid?: number
  ) {}

  public customer!: Customer;
}

const cascadeNoNavsModel = {
  customers: entity(
    Customer,
    {
      cid: int(),
      name: string(),
    },
    c => {
      c.key("cid");
      c.data(
        new Customer("Customer 1"),
        new Customer("Customer 2"),
        new Customer("Customer 3"),
        new Customer("Customer 4")
      );
    }
  ),
  orders: entity(
    Order,
    {
      oid: int(),
      customerId: int(),
      productId: int(),
    },
    o => {
      o.key("oid");
      o.data(new Order(1, 101), new Order(2, 101), new Order(3, 101), new Order(4, 101));
      o.references(Customer, "customerId");
    }
  ),
};

export const cascadeNoNavsFixture = (driver: Driver) => {
  return fixture(driver, cascadeNoNavsModel);
};

export const cascadeNoNavsTests = (verse: Verse<typeof cascadeNoNavsModel>) => {
  dbTest(verse);

  test("add explicit keys", async () => {
    const uow = verse.uow();

    const order = new Order(420, 101);
    const customer = new Customer("Customer 420", 420);

    await uow.add(order);

    expect(order.oid).not.toBe(0);

    await uow.add(customer);
    await uow.commit();

    expect(order.customerId).toBe(customer.cid);
  });

  test("add generated keys", async () => {
    const uow = verse.uow();

    const order = new Order(-1, 101);
    const customer = new Customer("Customer N");

    await uow.add(order);

    expect(order.oid).not.toBe(0);

    await uow.add(customer);

    expect(customer.cid).not.toBe(0);

    order.customerId = customer.cid!;

    await uow.commit();
  });

  test("add existing customer", async () => {
    const uow = verse.uow();

    const order = new Order(-1, 101);
    await uow.add(order);

    expect(order.oid).not.toBe(0);

    const customer = await uow.customers.single(c => c.cid === 1);

    order.customerId = customer.cid!;

    await uow.commit();
  });

  test("delete existing customer cascades loaded", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.single(c => c.cid === 3);
    const orders = await uow.orders.where(c => c.customerId === 3).toArray();

    uow.remove(customer);

    await uow.commit();

    expect(uow.entry(customer)).toBeUndefined();
    orders.forEach(o => expect(uow.entry(o)).toBeUndefined());
  });

  test("delete existing customer cascades not loaded", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.single(c => c.cid === 4);

    uow.remove(customer);

    await uow.commit();
  });

  test("reparent", async () => {
    const uow = verse.uow();

    const order1 = await uow.orders.first(c => c.customerId === 1);
    const order2 = await uow.orders.first(c => c.customerId === 2);

    order1.customerId = 2;
    order2.customerId = 1;

    await uow.commit();
  });

  test("add multiple", async () => {
    const uow = verse.uow();

    const customer1 = new Customer("Customer X");
    const customer2 = new Customer("Customer Y");
    const order1 = new Order(-1, 102);
    const order2 = new Order(-1, 103);

    await uow.add(order2, customer1, customer2, order1);

    order1.customerId = customer1.cid!;
    order2.customerId = customer2.cid!;

    await uow.commit();

    expect(customer1.cid).toBeGreaterThan(0);
    expect(customer2.cid).toBeGreaterThan(0);
    expect(order1.customerId).toBe(customer1.cid);
    expect(order2.customerId).toBe(customer2.cid);

    const dbCustomer1 = await verse.from.customers.where(c => c.name === "Customer X").single();

    const dbOrder1 = await verse.from.orders
      .where((o, $p: number) => o.customerId === $p, dbCustomer1.cid)
      .single();

    expect(dbOrder1.productId).toBe(102);

    const dbCustomer2 = await verse.from.customers.where(c => c.name === "Customer Y").single();

    const dbOrder2 = await verse.from.orders
      .where((o, $p: number) => o.customerId === $p, dbCustomer2.cid)
      .single();

    expect(dbOrder2.productId).toBe(103);
  });
};

const cascadeManyNavModel = {
  customers: entity(
    Customer,
    {
      cid: int(),
      name: string(),
      orders: many(Order, { foreignKey: "customerId" }),
    },
    c => {
      c.key("cid");
      c.data(
        new Customer("Customer 1"),
        new Customer("Customer 2"),
        new Customer("Customer 3"),
        new Customer("Customer 4"),
        new Customer("Customer 5")
      );
    }
  ),
  orders: entity(
    Order,
    {
      oid: int(),
      customerId: int(),
    },
    o => {
      o.key("oid");
      o.data(
        new Order(1, 101),
        new Order(2, 101),
        new Order(3, 101),
        new Order(4, 101),
        new Order(5, 101)
      );
    }
  ),
};

export const cascadeManyNavFixture = (driver: Driver) => {
  return fixture(driver, cascadeManyNavModel);
};

export const cascadeManyNavTests = (verse: Verse<typeof cascadeManyNavModel>) => {
  dbTest(verse);

  test("add explicit keys", async () => {
    const uow = verse.uow();

    const order = new Order(420, 101);

    await uow.add(order);

    expect(order.oid).not.toBe(0);

    const customer = new Customer("Customer 420", 420);

    await uow.add(customer);

    expect(customer.orders).toContain(order);

    await uow.commit();

    expect(customer.orders).toContain(order);
    expect(order.customerId).toBe(customer.cid);
  });

  test("add generated keys", async () => {
    const uow = verse.uow();

    const customer = new Customer("Customer N");

    await uow.add(customer);

    expect(customer.cid).not.toBe(0);

    const order = new Order(-1, 101);

    await uow.add(order);

    expect(order.oid).not.toBe(0);

    order.customerId = customer.cid!;

    await uow.commit();

    expect(customer.orders).toContain(order);
    expect(order.customerId).toBe(customer.cid);
  });

  test("add existing cascades", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.single(c => c.cid === 1);
    const order = new Order(-99, 101);

    customer.orders.push(order);

    await uow.commit();

    expect(order.customerId).toBe(customer.cid);
    expect(customer.orders).toContain(order);
  });

  test("add existing customer", async () => {
    const uow = verse.uow();

    const order = new Order(-1, 101);
    await uow.add(order);

    expect(order.oid).not.toBe(0);

    const customer = await uow.customers.single(c => c.cid === 1);

    order.customerId = customer.cid!;

    await uow.commit();

    expect(order.customerId).toBe(customer.cid);
    expect(customer.orders).toContain(order);
  });

  test("delete existing customer cascades loaded", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.single(c => c.cid === 3);
    const orders = await uow.orders.where(c => c.customerId === 3).toArray();

    expect(customer.orders.length).toBe(1);
    expect(uow.entry(customer.orders[0]!)!.state).toBe("unchanged");

    uow.remove(customer);

    expect(customer.orders.length).toBe(1);
    expect(uow.entry(customer.orders[0]!)!.state).toBe("removed");

    await uow.commit();

    expect(uow.entry(customer)).toBeUndefined();
    orders.forEach(o => expect(uow.entry(o)).toBeUndefined());
  });

  test("reparent", async () => {
    const uow = verse.uow();

    const customer1 = await uow.customers.single(c => c.cid === 1);
    const customer2 = await uow.customers.single(c => c.cid === 2);

    const order1 = await uow.orders.first(c => c.customerId === 1);
    const order2 = await uow.orders.first(c => c.customerId === 2);

    expect(customer1.orders).toContain(order1);
    expect(customer2.orders).toContain(order2);

    order1.customerId = 2;
    order2.customerId = 1;

    await uow.commit();

    expect(customer1.orders).toContain(order2);
    expect(customer2.orders).toContain(order1);
  });

  test("remove existing cascades", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.with(c => c.orders).single(c => c.cid === 2);

    expect(customer.orders.length).toBe(1);

    customer.orders.pop();

    await uow.commit();

    expect(customer.orders.length).toBe(0);

    const dbCustomer = await verse.from.customers.with(c => c.orders).single(c => c.cid === 2);

    expect(dbCustomer.orders.length).toBe(0);
  });

  test("remove existing cascades explicit load", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.single(c => c.cid === 5);

    await uow.orders.single(c => c.customerId === 5);

    expect(customer.orders.length).toBe(1);

    customer.orders.pop();

    await uow.commit();

    expect(customer.orders.length).toBe(0);

    const dbCustomer = await verse.from.customers.with(c => c.orders).single(c => c.cid === 5);

    expect(dbCustomer.orders.length).toBe(0);
  });
};

const cascadeOneNavModel = {
  customers: entity(
    Customer,
    {
      cid: int(),
      name: string(),
    },
    c => {
      c.key("cid");
      c.data(
        new Customer("Customer 1"),
        new Customer("Customer 2"),
        new Customer("Customer 3"),
        new Customer("Customer 4"),
        new Customer("Customer 5")
      );
    }
  ),
  orders: entity(
    Order,
    {
      oid: int(),
      customerId: int(),
      customer: one(Customer, { foreignKey: "customerId" }),
    },
    o => {
      o.key("oid");
      o.data(
        new Order(1, 101),
        new Order(2, 101),
        new Order(2, 101),
        new Order(3, 101),
        new Order(4, 101),
        new Order(5, 101)
      );
    }
  ),
};

export const cascadeOneNavFixture = (driver: Driver) => {
  return fixture(driver, cascadeOneNavModel);
};

export const cascadeOneNavTests = (verse: Verse<typeof cascadeOneNavModel>) => {
  dbTest(verse);

  test("add explicit keys", async () => {
    const uow = verse.uow();

    const order = new Order(420, 101);

    await uow.add(order);

    expect(order.oid).not.toBe(0);

    const customer = new Customer("Customer 420", 420);

    await uow.add(customer);

    expect(order.customer).toBe(customer);

    await uow.commit();

    expect(order.customer).toBe(customer);
    expect(order.customerId).toBe(customer.cid);
  });

  test("add generated keys", async () => {
    const uow = verse.uow();

    const customer = new Customer("Customer N");

    await uow.add(customer);

    expect(customer.cid).not.toBe(0);

    const order = new Order(-1, 101);

    await uow.add(order);

    expect(order.oid).not.toBe(0);

    order.customerId = customer.cid!;

    await uow.commit();

    expect(order.customer).toBe(customer);
    expect(order.customerId).toBe(customer.cid);
  });

  test("add existing cascades", async () => {
    const uow = verse.uow();

    const customer = (await uow.customers.single(c => c.cid === 1)) as Customer;
    const order = await uow.orders.first(c => c.customerId === 2);

    order.customer = customer;

    await uow.commit();

    expect(order.customer).toBe(customer);
    expect(order.customerId).toBe(customer.cid);
  });

  test("add existing customer", async () => {
    const uow = verse.uow();

    const order = new Order(-1, 101);
    await uow.add(order);

    expect(order.oid).not.toBe(0);

    const customer = (await uow.customers.single(c => c.cid === 1)) as Customer;

    order.customer = customer;

    await uow.commit();

    expect(order.customer).toBe(customer);
    expect(order.customerId).toBe(customer.cid);
  });

  test("delete existing customer cascades loaded", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.single(c => c.cid === 3);
    const orders = await uow.orders.where(c => c.customerId === 3).toArray();

    orders.forEach(o => {
      expect(o.customer).toBe(customer);
      expect(uow.entry(o)!.state).toBe("unchanged");
    });

    uow.remove(customer);

    orders.forEach(o => {
      expect(o.customer).toBe(customer);
      expect(uow.entry(o)!.state).toBe("removed");
    });

    await uow.commit();

    expect(uow.entry(customer)).toBeUndefined();
    orders.forEach(o => expect(uow.entry(o)).toBeUndefined());
  });

  test("reparent", async () => {
    const uow = verse.uow();

    const customer1 = await uow.customers.single(c => c.cid === 1);
    const customer2 = await uow.customers.single(c => c.cid === 2);

    const order1 = await uow.orders.first(c => c.customerId === 1);
    const order2 = await uow.orders.first(c => c.customerId === 2);

    expect(order1.customer).toBe(customer1);
    expect(order2.customer).toBe(customer2);

    order1.customerId = 2;
    order2.customerId = 1;

    await uow.commit();

    expect(order1.customer).toBe(customer2);
    expect(order2.customer).toBe(customer1);
  });

  test("remove existing cascades", async () => {
    const uow = verse.uow();

    const order = await uow.orders.with(o => o.customer).single(o => o.customerId === 2);

    expect(order.customer).toBeDefined();

    // @ts-ignore
    order.customer = undefined;

    await uow.commit();

    expect(order.customer).not.toBeDefined();

    const dbOrder = await uow.orders.with(o => o.customer).maybeFirst(o => o.customerId === 2);

    expect(dbOrder).not.toBeDefined();
  });

  test("remove existing cascades explicit load", async () => {
    const uow = verse.uow();

    await uow.customers.single(c => c.cid === 5);

    const order = await uow.orders.single(c => c.customerId === 5);

    expect(order.customer).toBeDefined();

    // @ts-ignore
    order.customer = undefined;

    await uow.commit();

    expect(order.customer).not.toBeDefined();

    const dbOrder = await uow.orders.with(o => o.customer).maybeFirst(o => o.customerId === 2);

    expect(dbOrder).not.toBeDefined();
  });
};

const cascadeBothNavsModel = {
  customers: entity(
    Customer,
    {
      cid: int(),
      name: string(),
      orders: many(Order, { foreignKey: "customerId" }),
    },
    c => {
      c.key("cid");
      c.data(
        new Customer("Customer 1"),
        new Customer("Customer 2"),
        new Customer("Customer 3"),
        new Customer("Customer 4"),
        new Customer("Customer 5")
      );
    }
  ),
  orders: entity(
    Order,
    {
      oid: int(),
      customerId: int(),
      customer: one(Customer, { foreignKey: "customerId" }),
    },
    o => {
      o.key("oid");
      o.data(
        new Order(1, 101),
        new Order(2, 101),
        new Order(3, 101),
        new Order(4, 101),
        new Order(5, 101)
      );
    }
  ),
};

export const cascadeBothNavsFixture = (driver: Driver) => {
  return fixture(driver, cascadeBothNavsModel);
};

export const cascadeBothNavsTests = (verse: Verse<typeof cascadeBothNavsModel>) => {
  dbTest(verse);

  test("add explicit keys", async () => {
    const uow = verse.uow();

    const order = new Order(420, 101);

    await uow.add(order);

    expect(order.oid).not.toBe(0);

    const customer = new Customer("Customer 420", 420);

    await uow.add(customer);

    expect(customer.orders).toContain(order);
    expect(order.customer).toBe(customer);

    await uow.commit();

    expect(customer.orders).toContain(order);
    expect(order.customer).toBe(customer);
    expect(order.customerId).toBe(customer.cid);
  });

  test("add generated keys", async () => {
    const uow = verse.uow();

    const customer = new Customer("Customer N");

    await uow.add(customer);

    expect(customer.cid).not.toBe(0);

    const order = new Order(-1, 101);

    await uow.add(order);

    expect(order.oid).not.toBe(0);

    order.customerId = customer.cid!;

    await uow.commit();

    expect(customer.orders).toContain(order);
    expect(order.customer).toBe(customer);
    expect(order.customerId).toBe(customer.cid);
  });

  test("add existing cascades", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.single(c => c.cid === 1);
    const order = new Order(-99, 101);

    customer.orders.push(order);

    await uow.commit();

    expect(order.customerId).toBe(customer.cid);
    expect(order.customer).toBe(customer);
    expect(customer.orders).toContain(order);
  });

  test("add existing customer", async () => {
    const uow = verse.uow();

    const order = new Order(-1, 101);
    await uow.add(order);

    expect(order.oid).not.toBe(0);

    const customer = await uow.customers.single(c => c.cid === 1);

    order.customerId = customer.cid!;

    await uow.commit();

    expect(order.customerId).toBe(customer.cid);
    expect(order.customer).toBe(customer);
    expect(customer.orders).toContain(order);
  });

  test("delete existing customer cascades loaded", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.single(c => c.cid === 3);
    const orders = await uow.orders.where(c => c.customerId === 3).toArray();

    expect(customer.orders.length).toBe(1);
    expect(orders[0]!.customer).toBe(customer);
    expect(uow.entry(customer.orders[0]!)!.state).toBe("unchanged");

    uow.remove(customer);

    expect(customer.orders.length).toBe(1);
    expect(orders[0]!.customer).toBe(customer);
    expect(uow.entry(customer.orders[0]!)!.state).toBe("removed");

    await uow.commit();

    expect(uow.entry(customer)).toBeUndefined();
    orders.forEach(o => expect(uow.entry(o)).toBeUndefined());
  });

  test("reparent", async () => {
    const uow = verse.uow();

    const customer1 = await uow.customers.single(c => c.cid === 1);
    const customer2 = await uow.customers.single(c => c.cid === 2);

    const order1 = await uow.orders.first(c => c.customerId === 1);
    const order2 = await uow.orders.first(c => c.customerId === 2);

    expect(customer1.orders).toContain(order1);
    expect(order1.customer).toBe(customer1);
    expect(customer2.orders).toContain(order2);
    expect(order2.customer).toBe(customer2);

    order1.customerId = 2;
    order2.customerId = 1;

    await uow.commit();

    expect(customer1.orders).toContain(order2);
    expect(order2.customer).toBe(customer1);
    expect(customer2.orders).toContain(order1);
    expect(order1.customer).toBe(customer2);
  });

  test("remove existing cascades", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.with(c => c.orders).single(c => c.cid === 2);

    expect(customer.orders.length).toBe(1);
    expect(customer.orders[0]!.customer).toBe(customer);

    customer.orders.pop();

    await uow.commit();

    expect(customer.orders.length).toBe(0);

    const dbCustomer = await verse.from.customers.with(c => c.orders).single(c => c.cid === 2);

    expect(dbCustomer.orders.length).toBe(0);
  });

  test("remove existing cascades explicit load", async () => {
    const uow = verse.uow();

    const customer = await uow.customers.single(c => c.cid === 5);

    const order = await uow.orders.single(c => c.customerId === 5);

    expect(customer.orders.length).toBe(1);
    expect(order.customer).toBe(customer);

    customer.orders.pop();

    await uow.commit();

    expect(customer.orders.length).toBe(0);

    const dbCustomer = await verse.from.customers.with(c => c.orders).single(c => c.cid === 5);

    expect(dbCustomer.orders.length).toBe(0);
  });
};
