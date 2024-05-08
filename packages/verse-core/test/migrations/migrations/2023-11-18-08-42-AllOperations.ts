import { column, DB, Migration } from "../../../src/migrations/index.js";

const migration: Migration = (db: DB) => {
  db.createTable(
    "all_ops",
    {
      col1: column("integer", { default: { value: 42 } }),
      col9: column("varchar(12)", { nullable: false }),
    },
    { key: "col1" }
  );

  db.createIndex("idx1", "all_ops", "col9");
  db.dropIndex("all_ops", "idx1");
  db.renameTable("all_ops", "all_ops2");
  db.addColumn("all_ops2", "col2", "integer");
  db.addColumn("all_ops2", "col4", "varchar(255)");

  if (db.info.name !== "sqlite") {
    if (db.info.name !== "mssql") {
      if (db.info.name !== "oracle") {
        db.alterColumn("all_ops2", "col1", {
          type: "integer",
          identity: true,
          default: { value: null },
        });

        db.alterColumn("all_ops2", "col1", { type: "integer", identity: false });
      } else {
        db.addColumn("all_ops2", "col11", "integer", { identity: true });
        db.alterColumn("all_ops2", "col11", { identity: false });
      }
    }

    db.alterColumn("all_ops2", "col4", { type: "varchar(255)", default: { sql: "'hello!'" } });
    db.alterColumn("all_ops2", "col4", { type: "varchar(256)", default: { value: null } });

    db.alterColumn("all_ops2", "col9", { nullable: true, type: "varchar(45)" });
    db.alterColumn("all_ops2", "col9", { nullable: false, type: "varchar(45)" });
  }

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

  db.createTable("moar", {
    colA: column("integer", { nullable: false }),
    colB: column("varchar(12)"),
  });

  db.createTable(
    "other",
    {
      colA1: column("integer"),
      colB2: column("varchar(12)"),
    },
    {
      foreignKeys: {
        columns: "colA1",
        target: "moar",
        references: "colA",
      },
    }
  );

  if (db.info.name !== "sqlite") {
    db.addPrimaryKey("moar", "colA");
    db.addForeignKey("other", "colA1", "moar", "colA");
  }
};

export default migration;
