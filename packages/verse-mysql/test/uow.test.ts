import {
  mixedKeyFixture,
  mixedKeyTests,
  uowFixture,
  uowTests,
} from "@operativa/verse/test/update/uow";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  uowTests(uowFixture(testDb("uow")));
});

describe("mixed key", () => {
  mixedKeyTests(mixedKeyFixture(testDb("mixedkey")));
});
