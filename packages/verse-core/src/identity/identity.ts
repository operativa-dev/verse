import { IdGenerator } from "./generator.js";

export class Identity implements IdGenerator<number> {
  static readonly INSTANCE = new Identity();

  #temp = 0;

  private constructor() {}

  async next() {
    return --this.#temp;
  }
}
