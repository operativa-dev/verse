import { navsFixture, navsTests } from "@operativa/verse/test/query/navigations";
import { describe } from "vitest";
import { testDb } from "./infra.js";

const fixture = navsFixture(testDb("chinook"));

describe("shared", () => {
  navsTests(fixture);
});
