import { conversionFixture, conversionTests } from "@operativa/verse/test/mapping/conversion";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  conversionTests(conversionFixture(testDb("conversion")));
});
