import {
  mixedKeyFixture,
  mixedKeyTests,
  nonKeyIdentityFixture,
  nonKeyIdentityTests,
  uowFixture,
  uowTests,
} from "@operativa/verse/test/update/uow";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => {
  uowTests(uowFixture(testDb("uow")));
});

describe("non-key identity", () => {
  nonKeyIdentityTests(nonKeyIdentityFixture(testDb("nonkeyidentity")));
});

describe("mixed key", () => {
  mixedKeyTests(mixedKeyFixture(testDb("mixedkey")));
});
