import { List } from "immutable";
import { Driver } from "../db/driver.js";
import { SqlFunction, SqlSelect, sqlStr } from "../db/sql.js";
import { IdGenerator } from "./generator.js";

export class SeqHilo implements IdGenerator<number> {
  #hi = 0;
  #low = 0;

  constructor(
    private readonly driver: Driver,
    private readonly sequence: string,
    private readonly block = 10
  ) {}

  async next() {
    if (this.#low === this.#hi) {
      const fn = this.driver.rows(
        new SqlSelect({
          projection: new SqlFunction("nextval", List.of(sqlStr(this.sequence))),
        })
      );

      for await (const row of fn([])) {
        this.#low = Number(row[0]);
      }

      this.#hi = this.#low + this.block;
    }

    return this.#low++;
  }
}
