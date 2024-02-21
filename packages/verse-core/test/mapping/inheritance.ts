import { beforeAll, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { entity, int, string } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dataTest, fixture } from "../infra.js";

export class Vehicle {
  readonly id!: number;

  constructor(
    readonly make: string,
    readonly model: string,
    readonly year?: number
  ) {}
}

export class Motorbike extends Vehicle {
  constructor(
    make: string,
    model: string,
    year?: number,
    readonly ccs = 1500
  ) {
    super(make, model, year);
  }
}

export class Automobile extends Vehicle {
  constructor(
    make: string,
    model: string,
    year?: number,
    readonly wheels?: number
  ) {
    super(make, model, year);
  }
}

export class Car extends Automobile {
  constructor(
    make: string,
    model: string,
    year?: number,
    wheels = 4,
    readonly doors = 4
  ) {
    super(make, model, year, wheels);
  }
}

export class Truck extends Automobile {
  constructor(
    make: string,
    model: string,
    year?: number,
    wheels = 18,
    readonly doors = 2,
    readonly capacity = 100
  ) {
    super(make, model, year, wheels);
  }
}

const inheritanceModel = {
  entities: {
    vehicles: entity(Vehicle, {
      id: int(),
      make: string(),
      model: string(),
      year: int({ nullable: true }),
    }),

    bikes: entity(Motorbike, {
      ccs: int(),
    }),
    autos: entity(Automobile, {
      wheels: int(),
    }),
    cars: entity(Car, {
      doors: int(),
    }),
    trucks: entity(Truck, {
      doors: int({ column: "TruckDoors" }),
      capacity: int(),
    }),
  },
};

export const inheritanceFixture = (driver: Driver) => {
  return fixture(driver, inheritanceModel);
};

export const inheritanceTests = (verse: Verse<typeof inheritanceModel.entities>) => {
  const snap = dataTest(verse);

  beforeAll(async () => {
    await verse.database.recreate();

    const uow = verse.uow();

    await uow.vehicles.add(new Car("Audi", "RS3", 2018), new Truck("Freightliner", "New Cascadia"));

    await uow.commit();
  });

  test("query vehicles", async () => {
    const q = verse.from.vehicles;

    await snap(q);
  });

  test("query autos", async () => {
    const q = verse.from.autos;

    await snap(q);
  });

  test("query cars", async () => {
    const q = verse.from.cars;

    await snap(q);
  });
};
