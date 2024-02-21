import { MySqlDriver } from "../src/index.js";

export const testDb = (name: string) =>
  new MySqlDriver(`mysql://root:mysql@localhost:3306/${name}`);
