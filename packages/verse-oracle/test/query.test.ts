import { queryErrorTests, queryFixture, queryTests } from "@operativa/verse/test/query/query";
import { describe } from "vitest";
import { testDb } from "./infra.js";

const fixture = queryFixture(testDb("`"));

describe("shared", () => {
  queryTests(fixture);
});

describe("shared errors", () => {
  queryErrorTests(fixture);
});
