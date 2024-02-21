import { column, DB, Migration } from "../../src/index.js";

const migration: Migration = (db: DB) => {
  db.createTable("t2", { name: column("text") });
};

export default migration;
