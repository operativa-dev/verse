import { List } from "immutable";
import { describe, expect, test } from "vitest";
import { notEmpty } from "../../src/utils/check.js";

describe("check", () => {
  test("notEmpty - string", () => {
    expect(() => notEmpty({ a: null })).toThrow("Argument 'a' cannot be undefined or null!");
    expect(() => notEmpty({ a: undefined })).toThrow("Argument 'a' cannot be undefined or null!");
    expect(() => notEmpty({ a: "" })).toThrow("Argument 'a' cannot be empty or whitespace!");
    expect(() => notEmpty({ a: " " })).toThrow("Argument 'a' cannot be empty or whitespace!");
    expect(() => notEmpty({ a: "\t" })).toThrow("Argument 'a' cannot be empty or whitespace!");

    notEmpty({ a: " abc" });
  });

  test("notEmpty - list", () => {
    expect(() => notEmpty({ a: List() })).toThrow("Argument 'a' cannot be empty!");

    notEmpty({ a: List.of(42) });
  });
});
