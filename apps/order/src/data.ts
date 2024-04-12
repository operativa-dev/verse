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
const populateProducts: Array<ProductType> = [
  {
    productId: 1,
    name: "Potato",
    description: "Fresh from the farm",
    price: 10,
  },
];
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
    builder.data(...populateProducts);
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
const populateOrders: Array<OrderType> = [
  {
    orderId: 1,
    token: 1,
    userId: 1,
    created: new Date(),
    lastUpdated: new Date(),
    lock: false,
  },
];
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
    builder.data(...populateOrders);
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
const populateItems: Array<ItemType> = [
  {
    itemId: 1,
    version: 1,
    orderId: 1,
    productId: 1,
    quantity: 2,
    overridePrice: 8,
  },
];
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
    builder.data(...populateItems);
  }
);

export type UserType = {
  userId: number;
  firstName: string;
};
const populateUsers: Array<UserType> = [
  { userId: -1, firstName: "Will" },
  { userId: -2, firstName: "Ben" },
];
const User = entity(
  {
    userId: int(),
    firstName: string(),
  },
  builder => {
    builder.table("users");
    builder.key("userId");
    builder.data(...populateUsers);
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
