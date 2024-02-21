import { withErrorTests, withFixture, withTests } from "@operativa/verse/test/query/with";
import { describe } from "vitest";
import { testDb } from "./infra.js";

const fixture = withFixture(testDb("Chinook"));

describe("shared", () => {
  withTests(fixture);
});

describe("shared errors", () => {
  withErrorTests(fixture);
});
