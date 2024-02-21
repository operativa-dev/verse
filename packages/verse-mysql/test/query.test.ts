import { queryErrorTests, queryFixture, queryTests } from "@operativa/verse/test/query/query";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  queryTests(queryFixture(testDb("Chinook")));
});

describe("shared errors", () => {
  queryErrorTests(queryFixture(testDb("Chinook")));
});
