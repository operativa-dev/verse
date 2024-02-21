import { List } from "immutable";
import { beforeAll, expect, test } from "vitest";
import { SeqHilo } from "../../src/identity/seqhilo.js";
import { SingleTableInheritance } from "../../src/inheritance/sti.js";
import { Model, SequenceModel } from "../../src/model/model.js";
import { Config, DbOperations } from "../../src/verse.js";

export const seqHiloTests = (config: Config) => {
  beforeAll(async () => {
    await new DbOperations({
      config,
      model: new Model(List(), List(), List.of(new SequenceModel("test_seq", 34, 10))),
      inheritance: new SingleTableInheritance(),
    }).recreate();
  });

  test("next", async () => {
    const seqHilo = new SeqHilo(config.driver, "test_seq");

    for (let i = 0; i < 123; i++) {
      const next = await seqHilo.next();

      expect(next).toBe(34 + i);
    }
  });
};
