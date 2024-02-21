import { withComplexFixture, withComplexTests } from "@operativa/verse/test/query/with.complex";
import { describe } from "vitest";
import { testDb } from "./infra.js";

const fixture = withComplexFixture(testDb());

describe("shared", () => {
  withComplexTests(fixture);
});
