import { DB, Migration } from "@operativa/verse-migrations";

const migration: Migration = (db: DB) => {
  db.insert("todos", ["Title", "Completed"], ["My first todo", true]);
  db.insert("todos", ["Title", "Completed"], ["My second todo", false]);
};

export default migration;
