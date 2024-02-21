import { conditionsFixture, conditionsTests } from "@operativa/verse/test/mapping/conditions";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  const verse = conditionsFixture(testDb("Conditions"));

  conditionsTests(verse);
});
