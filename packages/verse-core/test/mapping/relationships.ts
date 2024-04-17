// noinspection JSUnusedGlobalSymbols

import { Driver } from "../../src/db/driver.js";
import { entity, int, many, one } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dbTest, fixture } from "../infra.js";

const Parent = entity(
  {
    parentPk: int(),
    children1: many("Child", { foreignKey: "parentFk1" }),
  },
  c => {
    c.key("parentPk");
    c.data(
      { parentPk: 1, children1: [] },
      { parentPk: 2, children1: [] },
      { parentPk: 3, children1: [] },
      { parentPk: 4, children1: [] }
    );
  }
);

const relationshipsModel = {
  parents: Parent,
  children: entity(
    {
      childPk: int(),
      parentFk1: int(),
      parentFk2: int({ nullable: true }),
      parent2: one("Parent", { foreignKey: "parentFk2" }),
    },
    o => {
      o.key("childPk");
      o.data(
        { childPk: 1, parentFk1: 1 },
        { childPk: 2, parentFk1: 1 },
        { childPk: 3, parentFk1: 2, parentFk2: 1 },
        { childPk: 4, parentFk1: 2 }
      );
      o.references(Parent, "parentFk2", { onDelete: "no action" });
    }
  ),
};

export const relationshipsFixture = (driver: Driver) => {
  return fixture(driver, relationshipsModel);
};

export const relationshipsTests = (verse: Verse<typeof relationshipsModel>) => {
  dbTest(verse);
};
