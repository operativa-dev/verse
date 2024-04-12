import { DB, Migration } from "@operativa/verse-migrations";

const migration: Migration = (db: DB) => {
  db.insert("users", ["FirstName"], ["Will"]);
  db.insert("users", ["FirstName"], ["Ben"]);
  db.insert(
    "products",
    ["ProductId", "Name", "Description", "Price"],
    [1, "Potato", "Fresh from the farm", 10]
  );
  db.insert(
    "orders",
    ["OrderId", "Token", "UserId", "Created", "LastUpdated", "Lock"],
    [1, 1, 1, "2024-04-12T12:42:05.972Z", "2024-04-12T12:42:05.972Z", false]
  );
  db.insert(
    "items",
    ["ItemId", "_version", "OrderId", "ProductId", "Quantity", "OverridePrice"],
    [1, 1, 1, 1, 2, 8]
  );
};

export default migration;
