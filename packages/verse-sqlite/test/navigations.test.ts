import { navsFixture, navsTests } from "@operativa/verse/test/query/navigations";
import { describe } from "vitest";
import { testDb } from "./infra.js";

const verse = navsFixture(testDb("Chinook_Sqlite"));

describe("shared", () => {
  navsTests(verse);
});
