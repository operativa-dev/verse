import { verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { date, entity, int, string } from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

export class User {
  public readonly userId!: number;
  constructor(public firstName: string) {}
}
export class Product {
  public readonly productId!: number;
  constructor(
    public name: string,
    public description: string,
    public price: number
  ) {}
}
export class Order {
  public readonly orderId!: number;
  public readonly token!: number;
  constructor(
    public userId: number,
    public created: Date,
    public lastUpdated: Date
  ) {}
}
export class Item {
  public readonly itemId!: number;
  public version?: number;
  constructor(
    public orderId: number,
    public productId: number,
    public quantity: number,
    public overridePrice: number
  ) {}
}

export const db = verse({
  config: {
    driver: sqlite("order.sqlite"),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      users: entity(
        User,
        {
          userId: int(),
          firstName: string(),
        },
        t => {
          t.table("users");
          t.key("userId");
          t.data(new User("Will"), new User("Ben"));
        }
      ),
      products: entity(
        Product,
        {
          productId: int(),
          name: string(),
          description: string(),
          price: int(),
        },
        t => {
          t.table("products");
          t.key("productId");
          t.data(
            new Product("Potato", "Fresh from the farm", 10),
            new Product("Banana", "Yellow and ripe", 6)
          );
        }
      ),
      orders: entity(
        Order,
        {
          orderId: int(),
          userId: int(),
          created: date(),
          lastUpdated: date(),
          token: int({ generate: { default: 1 } }),
        },
        t => {
          t.table("orders");
          t.key("orderId");
          t.data(new Order(0, new Date(), new Date()));
          t.concurrency({ version: "token" });
        }
      ),
      items: entity(
        Item,
        {
          itemId: int(),
          orderId: int(),
          productId: int(),
          quantity: int(),
          overridePrice: int(),
          version: int({ column: "_version" }),
        },
        t => {
          t.table("items");
          t.key("itemId");
          t.data(new Item(1, 1, 2, 8));
        }
      ),
    },
  },
});
