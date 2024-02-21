import { MssqlDriver } from "../src/index.js";

export const testDb = (name: string) =>
  new MssqlDriver({
    server: "localhost",
    port: 1433,
    database: name,
    user: "sa",
    password: "Password1",
    options: {
      trustServerCertificate: true,
    },
  });
