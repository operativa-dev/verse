import { DB, Migration } from "@operativa/verse/migrations/index";

const migration: Migration = (db: DB) => {
  db.insert("Customer", ["Id", "Name", "Dob"], [3, "C", null]);
};

export default migration;
