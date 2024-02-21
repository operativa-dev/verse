import { optimisticFixture, optimisticTests } from "@operativa/verse/test/update/optimistic";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  optimisticTests(optimisticFixture(testDb("optimistic")));
});
