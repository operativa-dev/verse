import { verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { boolean, date, entity, int, string } from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

export type ProductType = {
  productId: number;
  name: string;
  description: string;
  price: number;
};

const Product = entity(
  {
    productId: int(),
    name: string(),
    description: string(),
    price: int(),
  },
  builder => {
    builder.table("products");
    builder.key("productId");
  }
);

export type OrderType = {
  orderId: number;
  token: number;
  userId: number;
  created: Date;
  lastUpdated: Date;
  lock: boolean;
};

const Order = entity(
  {
    orderId: int(),
    token: int({ generate: { default: 1 } }),
    userId: int(),
    created: date(),
    lastUpdated: date(),
    lock: boolean(),
  },
  builder => {
    builder.table("orders");
    builder.key("orderId");
    builder.concurrency({ version: "token" });
  }
);

export type ItemType = {
  itemId: number;
  version?: number;
  orderId: number;
  productId: number;
  quantity: number;
  overridePrice: number;
};

const Item = entity(
  {
    itemId: int(),
    version: int({ column: "_version" }),
    orderId: int(),
    productId: int(),
    quantity: int(),
    overridePrice: int(),
  },
  builder => {
    builder.table("items");
    builder.key("itemId");
  }
);

export type UserType = {
  userId: number;
  firstName: string;
};

const User = entity(
  {
    userId: int(),
    firstName: string(),
  },
  builder => {
    builder.table("users");
    builder.key("userId");
  }
);

export const db = verse({
  config: {
    driver: sqlite("order.sqlite"),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      users: User,
      products: Product,
      orders: Order,
      items: Item,
    },
  },
});
