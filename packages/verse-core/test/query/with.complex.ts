import { beforeAll, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { entity, int, many, one } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dataTest, fixture } from "../infra.js";

export class Base {
  constructor(
    readonly baseId: number,
    readonly as?: BranchA[],
    readonly bs?: BranchB[]
  ) {}
}

export class BranchA {
  constructor(
    readonly aId: number,
    readonly baseId: number,
    readonly cs?: LeafC[]
  ) {}
}

export class BranchB {
  constructor(
    readonly bId: number,
    readonly baseId: number
  ) {}
}

export class LeafC {
  constructor(
    readonly cId: number,
    readonly aId: number
  ) {}
}

export class LeafD {
  constructor(
    readonly dId: number,
    readonly bId: number,
    readonly b?: BranchB
  ) {}
}

const withComplexModel = {
  bases: entity(
    Base,
    {
      baseId: int({ generate: { using: "none" } }),
      as: many(BranchA),
      bs: many(BranchB),
    },
    b => {
      b.key("baseId");
    }
  ),
  as: entity(
    BranchA,
    {
      aId: int({ generate: { using: "none" } }),
      baseId: int(),
      cs: many(LeafC),
    },
    a => {
      a.key("aId");
    }
  ),
  bs: entity(
    BranchB,
    {
      bId: int({ generate: { using: "none" } }),
      baseId: int(),
    },
    b => {
      b.key("bId");
    }
  ),
  cs: entity(
    LeafC,
    {
      cId: int({ generate: { using: "none" } }),
      aId: int(),
    },
    c => {
      c.key("cId");
    }
  ),
  ds: entity(
    LeafD,
    {
      dId: int({ generate: { using: "none" } }),
      bId: int(),
      b: one(BranchB),
    },
    d => {
      d.key("dId");
    }
  ),
};

export const withComplexFixture = (driver: Driver) => {
  return fixture(driver, withComplexModel);
};

export const withComplexTests = (verse: Verse<typeof withComplexModel>) => {
  const snap = dataTest(verse);

  beforeAll(async () => {
    await verse.database.recreate();

    const uow = verse.uow();

    await uow.bases.add(new Base(1), new Base(2), new Base(3), new Base(4), new Base(5));

    await uow.as.add(
      new BranchA(1, 1),
      new BranchA(2, 1),
      new BranchA(3, 2),
      new BranchA(4, 3),
      new BranchA(5, 5)
    );

    await uow.bs.add(
      new BranchB(1, 1),
      new BranchB(2, 2),
      new BranchB(3, 3),
      new BranchB(4, 4),
      new BranchB(5, 5)
    );

    await uow.cs.add(
      new LeafC(1, 1),
      new LeafC(2, 2),
      new LeafC(3, 3),
      new LeafC(4, 4),
      new LeafC(5, 5)
    );

    await uow.ds.add(
      new LeafD(1, 1),
      new LeafD(2, 2),
      new LeafD(3, 3),
      new LeafD(4, 5),
      new LeafD(5, 5)
    );

    await uow.commit();
  });

  test("base -> as -> cs, bs", async () => {
    const q = verse.from.bases.with(b => b.as?.with(b => b.cs)).with(b => b.bs);

    await snap(q);
  });
};
