import { Verse } from "@operativa/verse";
import { Driver } from "@operativa/verse/db/driver";
import { entity, int, string } from "@operativa/verse/model/builder";
import { fixture, resetSql, snap, snapModel, snapSql } from "@operativa/verse/test/infra";
import fs, { existsSync } from "fs";
import { afterEach, beforeEach, expect, test } from "vitest";
import { Migrator } from "../src/index.js";

class Customer {
  id!: number;
  name!: string;
}

const migrationsModel = {
  entities: {
    es: entity(Customer, { id: int(), name: string() }),
  },
};

export const migrationsFixture = (driver: Driver) => {
  return fixture(driver, migrationsModel);
};

export const migrationsTests = (
  factory: (db: string) => Verse<typeof migrationsModel.entities>,
  dropAfter = false
) => {
  let migrator: Migrator;
  let verse: Verse<typeof migrationsModel.entities>;

  beforeEach(async ctx => {
    const db = ctx.task.name.replace(/ /g, "_").slice(0, 30);
    verse = factory(db);

    if (db !== "model") {
      await verse.config.driver.drop();
    }

    migrator = new Migrator(verse, `${__dirname}/migrations`, verse.config.logger);

    resetSql(verse);
  });

  afterEach(async ctx => {
    await snapSql(ctx, verse);

    if (dropAfter) {
      await verse.config.driver.drop();
    }
  });

  test("model", async ctx => {
    await snapModel(ctx, verse);
  });

  test("create database when not exists", async () => {
    await migrator.migrate();

    expect(await verse.database.exists()).toEqual(true);
  });

  test("dont create database when exists", async () => {
    await verse.config.driver.create();
    await migrator.migrate();
  });

  test("migrations status", async ctx => {
    await verse.config.driver.create();
    const status = await migrator.status();

    await snap(ctx, status);
  });

  test("create migration", async ctx => {
    let path: string | undefined = undefined;

    try {
      path = await migrator.create("Next");

      expect(existsSync(path)).toEqual(true);

      const contents = fs.readFileSync(path, "utf8");

      await snap(ctx, contents, "txt");
    } finally {
      if (path) {
        fs.unlinkSync(path);
      }
    }
  });

  test("script migrations", async ctx => {
    const script = await migrator.script(false);

    await snap(ctx, script, "script.sql");
  });

  test("create migration bad filename", async () => {
    await expect(async () => await migrator.create("a!b")).rejects.toThrow(
      "Invalid migration name: 'a!b'."
    );
  });
};
