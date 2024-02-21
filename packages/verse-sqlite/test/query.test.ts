import { queryErrorTests, queryFixture, queryTests } from "@operativa/verse/test/query/query";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  const verse = queryFixture(testDb("Chinook_Sqlite"));

  queryTests(verse);
});

describe("shared errors", () => {
  queryErrorTests(queryFixture(testDb("Chinook_Sqlite")));
});
