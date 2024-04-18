import { oracle } from "../src/index.js";

export const testDb = (name: string) =>
  oracle(
    {
      user: name,
      password: name,
      connectString: "localhost/XE",
    },
    {
      user: "system",
      password: "Password1",
      connectString: "localhost/XE",
    }
  );
