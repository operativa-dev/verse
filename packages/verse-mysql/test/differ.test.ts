import { differTests } from "@operativa/verse/test/migrations/differ";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  differTests(testDb("differ"));
});
