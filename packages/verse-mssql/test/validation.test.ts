import { seqhiloFixture } from "@operativa/verse/test/model/validator.test";
import { expect, test } from "vitest";
import { testDb } from "./infra.js";

test("sequence prop throws", () => {
  expect(() => seqhiloFixture(testDb("Chinook"))).toThrow(
    "Scalar property 'id' cannot use 'seqhilo' generator. SQL Server does not support sequences."
  );
});
