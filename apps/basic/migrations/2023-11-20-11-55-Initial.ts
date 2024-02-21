import { column, DB, Migration } from "@operativa/verse-migrations";

const migration: Migration = (db: DB) => {
  db.createTable("todos", {
    id: column("integer"),
    title: column("varchar(255)"),
    completed: column("boolean"),
  });
};

export default migration;
