import { rawErrorTests, rawFixture, rawTests } from "@operativa/verse/test/query/raw";
import { describe } from "vitest";
import { testDb } from "./infra.js";

const fixture = rawFixture(testDb("chinook"));

describe("shared", () => {
  rawTests(fixture);
});

describe("shared errors", () => {
  rawErrorTests(fixture);
});
