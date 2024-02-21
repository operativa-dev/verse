import { Entities, Metadata } from "@operativa/verse";
import { Driver } from "@operativa/verse/db/driver";
import { date, entity, int, string } from "@operativa/verse/model/builder";
import { Model } from "@operativa/verse/model/model";
import { fixture, snap } from "@operativa/verse/test/infra";
import { afterEach, beforeEach, test } from "vitest";
import { ModelDiffer } from "../src/differ.js";
import { CodeGenerator } from "../src/generator.js";

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
