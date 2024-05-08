import { afterEach, beforeEach, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { ModelDiffer } from "../../src/migrations/differ.js";
import { CodeGenerator } from "../../src/migrations/generator.js";
import { date, entity, int, string } from "../../src/model/builder.js";
import { Model } from "../../src/model/model.js";
import { Entities, Metadata } from "../../src/verse.js";
import { fixture, snap } from "../infra.js";

class Customer {
  constructor(id?: number, name?: string, dob?: Date) {
    this.id = id!;
    this.name = name!;
    this.dob = dob;
  }

  id!: number;
  name!: string;
  dob?: Date | undefined;
}

export const differTests = (driver: Driver) => {
  const metadata = (entities: Entities) => fixture(driver, entities).metadata;

  let $current: Metadata | undefined;
  let $previous: ReturnType<Model["toObject"]>;
  let $ops: any[] = [];
  let $code: string;

  beforeEach(() => {
    $current = undefined;
    $ops = [];
    $code = "";
  });

  afterEach(async ctx => {
    $previous = JSON.parse($current!.model.toJSON());

    await snap(ctx, $ops);

    $code = new CodeGenerator().generate($ops);

    await snap(ctx, $code, "ts");
  });

  let $properties = { id: int(), name: string(), dob: date() };
  let $data = [{ id: 1, name: "A" }, new Customer(undefined, "B", new Date(2000, 1, 1))];

  test("version 1", async () => {
    $current = metadata({
      es: entity(Customer, $properties, e => e.data(...$data)),
    });

    $ops = await new ModelDiffer($current).diff();
  });

  test("version 2", async () => {
    $current = metadata({
      es: entity(Customer, $properties, e => e.data(...[...$data, new Customer(3, "C")])),
    });

    $ops = await new ModelDiffer($current).diff($previous);
  });

  test("version 3", async () => {
    $current = metadata({
      es: entity(Customer, $properties, e => e.data(new Customer(3, "D"))),
    });

    $ops = await new ModelDiffer($current).diff($previous);
  });
};
