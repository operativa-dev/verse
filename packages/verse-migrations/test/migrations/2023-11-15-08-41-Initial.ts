import { column, DB, Migration } from "../../src/index.js";

const migration: Migration = (db: DB) => {
  db.createTable("t1", {
    id: column("integer", { nullable: false }),
    name: column("varchar(10)"),
    active: column("boolean"),
  });
};

export default migration;
