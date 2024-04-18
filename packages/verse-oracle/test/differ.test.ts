import { differTests } from "@operativa/verse-migrations/test/differ";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  differTests(testDb("differ"));
});
