import { DB, Migration, column } from "@operativa/verse-migrations";
import { SqlColumn, SqlRaw, SqlType, primitiveToSql, sqlId } from "@operativa/verse/db/sql";
import { List } from "immutable";
import { Primitive } from "ts-essentials";

// export function column(type: SqlType, nullable = true, identity = false) {
//   return (name: string) => new SqlColumn(sqlId(name), type, nullable, identity);
// }
// export type DefaultOptions =
//   | {
//       value: Primitive;
//     }
//   | {
//       sql: string;
//     };
// export type ColumnOptions = {
//   nullable?: boolean;
//   identity?: boolean;
//   default?: DefaultOptions;
// };

// export function column(type: SqlType, options?: ColumnOptions) {
//   return (name: string) =>
//     new SqlColumn(
//       sqlId(name),
//       type,
//       options?.nullable,
//       options?.identity,
//       defaultNode(options?.default)
//     );
// }
// function defaultNode(value: DefaultOptions | undefined) {
//   if (value) {
//     if ("value" in value) {
//       return primitiveToSql(value.value)[0];
//     } else {
//       return new SqlRaw(List.of(value.sql));
//     }
//   }

//   return undefined;
// }

const migration: Migration = (db: DB) => {
  db.createTable("users", {
    userId: column("integer", { identity: true }),
    firstName: column("varchar(255)"),
  });
  db.createTable("products", {
    productId: column("integer", { identity: true }),
    name: column("varchar(255)"),
    description: column("integer"),
    price: column("integer"),
  });
  // token: int({ generate: { default: 1 } }),

  db.createTable("orders", {
    orderId: column("integer", { identity: true }),
    token: column("integer"),
    userId: column("integer"),
    created: column("integer"),
    lastUpdated: column("timestamp"),
    lock: column("boolean"),
  });
  db.createTable("items", {
    itemId: column("integer", { identity: true }),
    _version: column("integer"),
    orderId: column("integer"),
    productId: column("integer"),
    quantity: column("integer"),
    overridePrice: column("integer"),
  });
};

export default migration;
