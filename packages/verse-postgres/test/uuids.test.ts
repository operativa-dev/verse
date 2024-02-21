import { uuidFixture, uuidTests } from "@operativa/verse/test/update/uuids";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  uuidTests(uuidFixture(testDb("uuid")));
});
