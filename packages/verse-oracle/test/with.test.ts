import { withErrorTests, withFixture, withTests } from "@operativa/verse/test/query/with";
import { describe } from "vitest";
import { testDb } from "./infra.js";

const fixture = withFixture(testDb("chinook"));

describe("shared", () => {
  withTests(fixture);
});

describe("shared errors", () => {
  withErrorTests(fixture);
});
