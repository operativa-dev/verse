import { postgres } from "../src/index.js";

export const testDb = (name: string) =>
  postgres(`postgres://postgres:postgres@localhost:5432/${name}`);
