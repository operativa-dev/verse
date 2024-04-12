import { conventionsFixture, conventionsTests } from "@operativa/verse/test/conventions/custom";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  conventionsTests(conventionsFixture(testDb()));
});
