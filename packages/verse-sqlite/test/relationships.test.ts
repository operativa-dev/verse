import {
  relationshipsFixture,
  relationshipsTests,
} from "@operativa/verse/test/mapping/relationships";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  relationshipsTests(relationshipsFixture(testDb()));
});
