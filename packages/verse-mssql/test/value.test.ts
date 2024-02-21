import { valueFixture, valueTests } from "@operativa/verse/test/mapping/value";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  valueTests(valueFixture(testDb("ValueObjects")));
});
