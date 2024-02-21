import { objectsFixture, objectsTests } from "@operativa/verse/test/mapping/objects";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  objectsTests(objectsFixture(testDb("objects")));
});
