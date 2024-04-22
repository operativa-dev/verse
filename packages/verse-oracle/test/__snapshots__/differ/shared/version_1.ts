import { DB, Migration } from "@operativa/verse-migrations";

const migration: Migration = (db: DB) => {
  db.insert("Customer", ["Name", "Dob"], ["B", new Date("Mon, 31 Jan 2000 22:00:00 GMT")]);
  db.insert("Customer", ["Id", "Name", "Dob"], [1, "A", null]);
};

export default migration;
