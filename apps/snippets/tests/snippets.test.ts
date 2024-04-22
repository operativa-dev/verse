import { describe, test } from "vitest";

describe("sample snippets", () => {
  test("basic", async () => {
    await import("../src/basic.js");
  });

  test("builder", async () => {
    await import("../src/building.js");
  });

  test("query", async () => {
    await import("../src/query.js");
  });

  test("drivers", async () => {
    await import("../src/drivers.js");
  });

  test("entities", async () => {
    await import("../src/entities.js");
  });
});
