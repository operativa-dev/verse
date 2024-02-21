import { column, DB, Migration } from "../../src/index.js";

const migration: Migration = (db: DB) => {
  db.createTable("all_ops", { col1: column("integer") });
  db.createIndex("idx1", "all_ops", "col1");
  db.dropIndex("all_ops", "idx1");
  db.renameTable("all_ops", "all_ops2");
  db.addColumn("all_ops2", "col2", "integer");
  db.renameColumn("all_ops2", "col2", "col3");
  db.dropColumn("all_ops2", "col3");
  db.dropTable("all_ops2");

  if (db.info.name === "postgresql") {
    db.createSequence("seq1");
    db.dropSequence("seq1");
  }

  db.sql("insert into t1 (id) values (1)");

  db.insert("t1", ["id", "active"], [2, false], [3, true]);
  db.update("t1", { name: "foo" }, { id: 2 });
  db.delete("t1", { id: 3 });
};

export default migration;
