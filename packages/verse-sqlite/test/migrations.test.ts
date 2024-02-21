import { migrationsFixture, migrationsTests } from "@operativa/verse-migrations/test/migrations";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  migrationsTests(db => migrationsFixture(testDb(db)), true);
});
