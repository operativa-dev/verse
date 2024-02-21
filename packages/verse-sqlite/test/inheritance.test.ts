import { inheritanceFixture, inheritanceTests } from "@operativa/verse/test/mapping/inheritance";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  inheritanceTests(inheritanceFixture(testDb()));
});
