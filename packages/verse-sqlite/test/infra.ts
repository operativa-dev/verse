import { SqliteDriver } from "../src/index.js";

export const testDb = (name?: string) =>
  new SqliteDriver(name ? `${__dirname}/${name}.sqlite` : ":memory:");
