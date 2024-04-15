"use server";

import { ItemType, OrderType, ProductType, db } from "@/data";
import { redirect } from "next/navigation";

export async function removeItem($itemId: number, currentOrderId: number) {
  const uow = db.uow();
  const item = await uow.items.single((item, $itemId) => item.itemId === $itemId, $itemId);
  uow.items.remove(item);
  await uow.commit();
  redirect("/orders/" + currentOrderId);
}
export async function fetchItems(currentOrderId: number) {
  "use server";
  const uow = db.uow();
  const items = await uow.items
    .where((item, $currentOrderId) => item.orderId === $currentOrderId, currentOrderId)
    .toArray();
  return items;
}
export async function fetchOrder(currentOrderId: number) {
  "use server";
  const order = await db.from.orders
    .where((order, $orderIdIn: number) => order.orderId === $orderIdIn, currentOrderId)
    .single();
  return order;
}

export async function createOrderServer(data: any) {
  const uow = db.uow();
  const order = {
    userId: 1,
    created: new Date(),
    lastUpdated: new Date(),
    lock: false,
  } as OrderType;
  await uow.orders.add(order);

  await uow.commit();
  // iterate through data and add items
  let multipleObjectsCreated = new Array(data.length).fill(null).map((x, index) => {
    return {
      orderId: order.orderId,
      productId: data[index].productId,
      quantity: data[index].quantity,
      overridePrice: data[index].overridePrice,
    } as ItemType;
  });
  await uow.items.add(...multipleObjectsCreated);
  await uow.commit();

  redirect("/orders");
}
type ErrorObj = {
  error: string;
  currentChange: Array<ItemType>;
  serverChange: Array<ItemType>;
  orderLocked: boolean;
};
export async function getProductsResults(offset: number, limit: number, search: string) {
  "use server";

  const productsQueryParams = db.compile((from, $offset: number, $limit: number, $search: string) =>
    from.products
      .where(product => product.name.like(`%${$search}%`))
      .offset($offset)
      .limit($limit)
  );
  const productsQueryParamsCount = db.compile((from, $search: string) =>
    from.products.where(product => product.name.like(`%${$search}%`)).count()
  );
  return {
    count: await productsQueryParamsCount(search),
    // body: await productsQueryParams(offset, limit, search).toArray(),
    body: JSON.parse(JSON.stringify(await productsQueryParams(offset, limit, search).toArray())),
  };
}
export async function updateProduct(attribute: string, id: number, value: string | number) {
  const uow = db.uow();
  const product = await uow.products
    .where((product, $id) => product.productId === $id, id)
    .single();
  let dict: any = {};
  dict[attribute as keyof ProductType] = value;
  uow.entry(product)?.update(dict);
  await uow.commit();
  redirect("/products");
}

export async function lockOrderServer(order: OrderType, toLock: boolean) {
  const uow = db.uow();
  const orderServer = await uow.orders
    .where((order, $currentOrderId) => order.orderId === $currentOrderId, order.orderId)
    .single();
  uow.entry(orderServer)?.update({ lock: toLock });

  try {
    await uow.commit();
  } catch (e) {
    // check if e has property message
    const error = e as { message: string };

    return error.message;
  }
  if (toLock) {
    return "Locked";
  }

  return "Unlocked";
}

export async function updateOrderServer(
  items: Array<ItemType>,
  order: OrderType,
  itemsRemoved: Array<number>,
  forceUpdate: boolean,
  serverItems: Array<ItemType>,
  originalItems: Array<ItemType>
) {
  if (order.lock) {
    return {
      error: "Order is Locked",
      currentChange: [],
      serverChange: [],
      orderLocked: true,
    } as ErrorObj;
  }
  // if forceUpdate we need to remove version from items
  // set version to the latest version rather than removing it
  if (forceUpdate) {
    items.forEach(item => {
      // check if item is in
      if (item.version) {
        const serverItem = serverItems.find(serverItem => serverItem.itemId === item.itemId);
        if (serverItem) {
          item.version = serverItem.version;
        } else {
          delete item.version;
        }
      }
    });
  }

  const uow = db.uow();

  // items that were removed will have a positive ID

  // iterate through items and update or add
  for (const item of items) {
    // items with a negative ID are new
    if (item.itemId > 0) {
      const dbItem = await uow.items
        .where((item, $itemId) => item.itemId === $itemId, item.itemId)
        .maybeFirst();
      if (dbItem) {
        uow.entry(dbItem)?.update(item);
      } else {
        uow.items.add(item);
      }
    } else {
      uow.items.add(item);
    }
  }

  // remove items with ids in itemsRemoved
  // mark for deletion instead of removing
  for (const itemId of itemsRemoved) {
    const dbItem = await uow.items
      .where((item, $itemId) => item.itemId === $itemId, itemId)
      .maybeFirst();
    if (dbItem) {
      uow.items.remove(dbItem);
    }
  }

  // We want to update the order's last updated.
  // This will also check to see if the order has been updated by another user via the token.
  const orderServer = await uow.orders
    .where((order, $currentOrderId) => order.orderId === $currentOrderId, order.orderId)
    .single();

  if (orderServer.lock) {
    return {
      error: "Order is Locked",
      currentChange: [],
      serverChange: [],
      orderLocked: true,
    } as ErrorObj;
  }

  // if we are forcing an update we dont include token (which checks for concurrency issues)
  if (forceUpdate) {
    uow.entry(orderServer)?.update({ lastUpdated: new Date(), token: orderServer.token });
  } else {
    uow.entry(orderServer)?.update({ lastUpdated: new Date(), token: order.token });
  }

  let returnObject: ErrorObj = {
    error: "",
    currentChange: [],
    serverChange: [],
    orderLocked: false,
  };
  try {
    await uow.commit();
  } catch (e) {
    // check if e has property message
    const error = e as { message: string };

    const uow2 = db.uow();
    const serverItems = await uow2.items
      .where((item, $orderId) => item.orderId === $orderId, order.orderId)
      .toArray();
    // check if originalItems and serverItems are the same
    let itemsChanged = false;
    if (originalItems.length == serverItems.length) {
      for (let i = 0; i < serverItems.length; i++) {
        if (serverItems[i].itemId !== originalItems[i].itemId) {
          itemsChanged = true;
          break;
        }
      }
    } else {
      itemsChanged = true;
    }
    if (itemsChanged) {
      returnObject = {
        error: error.message,
        currentChange: items,
        serverChange: serverItems,
        orderLocked: order.lock,
      };
      return returnObject;
    } else {
      updateOrderServer(items, orderServer, itemsRemoved, true, serverItems, originalItems);
    }
  }

  return returnObject;
}
