import { creationFixture, creationTests } from "@operativa/verse/test/db/creation";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  creationTests(creationFixture(testDb()));
});
