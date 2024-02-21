import { v4 as uuidv4 } from "uuid";
import { IdGenerator } from "./generator.js";

export class Uuid implements IdGenerator<string> {
  static readonly INSTANCE = new Uuid();

  private constructor() {}

  async next() {
    return uuidv4();
  }
}
