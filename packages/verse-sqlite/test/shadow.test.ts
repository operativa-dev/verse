import { shadowFixture, shadowTests } from "@operativa/verse/test/mapping/shadow";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  shadowTests(shadowFixture(testDb()));
});
