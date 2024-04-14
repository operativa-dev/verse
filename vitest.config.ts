import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    hookTimeout: 60000,
  },
  esbuild: { target: "es2022" },
});
