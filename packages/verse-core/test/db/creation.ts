import { afterEach, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import {
  boolean,
  date,
  entity,
  int,
  number,
  string,
  value,
  valueObject,
} from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { fixture, snapModel, snapSql } from "../infra.js";

class Album {
  constructor(
    readonly albumId: number,
    readonly title: string,
    readonly artistId: number
  ) {}
}

class Artist {
  constructor(
    readonly artistId: number,
    readonly name: string
  ) {}
}

class AllTypes {
  constructor(
    readonly n1: number,
    readonly n2: number,
    readonly s1: string,
    readonly s2: string,
    readonly s3: string,
    readonly i: number,
    readonly uuid: string,
    readonly bool: boolean,
    readonly date: Date
  ) {}
}

class A {
  pk!: number;
  fk!: number;
  b!: B;
}

class B {
  foo!: number;
}

class Customer {
  readonly id!: number;

  constructor(
    readonly name: string,
    readonly address: Address
  ) {}
}

class Address {
  constructor(
    readonly street: string,
    readonly city: string
  ) {}
}

const creationModel = {
  entities: {
    albums: entity(Album, {
      albumId: int(),
      title: string({ maxLength: 160 }),
      artistId: int({ column: "artist_id" }),
    }),

    artists: entity(
      Artist,
      {
        artistId: int(),
        name: string(),
      },
      a => {
        a.table("artist");
      }
    ),

    allTypes: entity(
      AllTypes,
      {
        n1: number({ precision: 10, scale: 2 }),
        n2: number(),
        s1: string(),
        s2: string({ maxLength: 42 }),
        s3: string({ type: "text" }),
        i: int(),
        uuid: string({ type: "uuid" }),
        bool: boolean(),
        date: date(),
        shadow: string({ column: "shadow" }),
      },
      a => {
        a.key("n1");
      }
    ),

    as: entity(
      A,
      {
        pk: int(),
        fk: int(),
      },
      a => {
        a.key("pk");
        a.references(B, "fk");
      }
    ),

    bs: entity(
      B,
      {
        foo: int(),
      },
      b => {
        b.key("foo");
      }
    ),

    customers: entity(Customer, {
      id: int(),
      name: string(),
      address: value(Address, a => {
        a.properties({ city: string({ nullable: true }) });
      }),
    }),
  },
  values: [
    valueObject(Address, a => {
      a.properties({
        street: string(),
        city: string(),
      });
    }),
  ],
};

export const creationFixture = (driver: Driver) => {
  return fixture(driver, creationModel);
};

export const creationTests = (verse: Verse) => {
  afterEach(async ctx => {
    await snapSql(ctx, verse);
  });

  test("model", async ctx => {
    await snapModel(ctx, verse);
  });

  test("recreate", async () => {
    await verse.database.recreate();
  });
};
