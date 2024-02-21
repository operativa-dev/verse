import { describe, test } from "vitest";

describe("sample snippets", () => {
  test("basic", async () => {
    await import("../src/basic.js");
  });

  test("builder", async () => {
    await import("../src/building.js");
  });
});
