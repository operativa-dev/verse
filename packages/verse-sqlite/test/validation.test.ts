import { seqhiloFixture } from "@operativa/verse/test/model/validator.test";
import { expect, test } from "vitest";
import { sqlite } from "../src/index.js";

test("sequence prop throws", () => {
  expect(() => seqhiloFixture(sqlite("sqlite://:memory:"))).toThrow(
    "Scalar property 'id' cannot use 'seqhilo' generator. SQLite does not support sequences."
  );
});
