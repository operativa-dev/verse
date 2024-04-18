import { DB, Migration } from "@operativa/verse-migrations";

const migration: Migration = (db: DB) => {
  db.delete("Customer", { "Name": "B", "Dob": "2000-01-31T22:00:00.000Z" });
  db.update("Customer", { "Name": "D", "Dob": null }, { "Id": 3 });
  db.delete("Customer", { "Id": 1 });
};

export default migration;
