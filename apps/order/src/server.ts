"use server";

import { Item, Order, Product, db } from "@/data";
import { redirect } from "next/navigation";
type ProductType = Omit<Product, "productId" | "version">;

export async function addItem(data: FormData) {
  const orderId = parseInt(data.get("orderId")?.valueOf() + "");
  const productId = parseInt(data.get("productId")?.valueOf() + "");
  const quantity = parseInt(data.get("quantity")?.valueOf() + "");
  const price = parseInt(data.get("price")?.valueOf() + "");

  const uow = db.uow();
  await uow.items.add(new Item(orderId, productId, quantity, price));
  await uow.commit();

  redirect("/orders/" + orderId);
}

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
  return JSON.parse(JSON.stringify(items));
}
export async function fetchOrder(currentOrderId: number) {
  "use server";
  const order = await db.from.orders
    .where((order, $orderIdIn: number) => order.orderId === $orderIdIn, currentOrderId)
    .single();
  return JSON.parse(JSON.stringify(order));
}

export async function createOrderServer(data: any) {
  const uow = db.uow();
  const order = new Order(1, new Date(), new Date());
  await uow.add(order);
  await uow.commit();
  // iterate through data and add items
  let multipleObjectsCreated = new Array(data.length).fill(null).map((x, index) => {
    return new Item(
      order.orderId,
      data[index].productId,
      data[index].quantity,
      data[index].overridePrice
    );
  });
  await uow.items.add(...multipleObjectsCreated);
  await uow.commit();

  redirect("/orders");
}
type ErrorObj = {
  error: string;
  currentChange: Array<Item>;
  serverChange: Array<Item>;
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
  // let dict: Product = {};
  // dict[attribute as keyof ProductType] = value;
  uow.entry(product)?.update(dict);
  await uow.commit();
  redirect("/products");
}

export async function updateOrderServer(
  items: Array<Item>,
  order: Order,
  itemsRemoved: Array<number>,
  forceUpdate: boolean,
  serverItems: Array<Item>
) {
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

  // if we are forcing an update we dont include token (which checks for concurrency issues)
  if (forceUpdate) {
    uow.entry(orderServer)?.update({ lastUpdated: new Date() });
  } else {
    uow.entry(orderServer)?.update({ lastUpdated: new Date(), token: order.token });
  }

  let returnObject: ErrorObj = {
    error: "",
    currentChange: [],
    serverChange: [],
  };
  try {
    await uow.commit();
  } catch (e) {
    // check if e has property message
    const error = e as { message: string };

    // if (typeof error === "string") {
    //   throw new Error("Invalid Title");
    // }
    // if (error.hasOwnProperty("message")) {
    console.error("error", error); // from creation or business logic
    // }
    const uow2 = db.uow();
    const serverItems = await uow2.items
      .where((item, $orderId) => item.orderId === $orderId, order.orderId)
      .toArray();

    returnObject = {
      error: error.message,
      currentChange: items,
      serverChange: JSON.parse(JSON.stringify(serverItems)),
    };
    return returnObject;
  }

  return returnObject;
}
