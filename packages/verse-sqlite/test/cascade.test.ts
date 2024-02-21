import {
  cascadeBothNavsFixture,
  cascadeBothNavsTests,
  cascadeManyNavFixture,
  cascadeManyNavTests,
  cascadeNoNavsFixture,
  cascadeNoNavsTests,
  cascadeOneNavFixture,
  cascadeOneNavTests,
} from "@operativa/verse/test/update/cascade";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared no navs", () => {
  cascadeNoNavsTests(cascadeNoNavsFixture(testDb()));
});

describe("shared many nav", () => {
  cascadeManyNavTests(cascadeManyNavFixture(testDb()));
});

describe("shared one nav", () => {
  cascadeOneNavTests(cascadeOneNavFixture(testDb()));
});

describe("shared both navs", () => {
  cascadeBothNavsTests(cascadeBothNavsFixture(testDb()));
});
