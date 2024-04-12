import { MaxLengthDefault } from "../../src/conventions/database.js";
import { Driver } from "../../src/db/driver.js";
import { entity, int, string } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dbTest, fixture } from "../infra.js";

const conventionsModel = {
  entities: {
    customers: entity({
      id: int(),
      name: string(),
    }),
  },
};

export const conventionsFixture = (driver: Driver) => {
  return fixture(driver, conventionsModel, undefined, conventions => {
    const index = conventions.findIndex(c => c instanceof MaxLengthDefault);

    conventions[index] = new MaxLengthDefault(100);

    return conventions;
  });
};

export const conventionsTests = (verse: Verse<typeof conventionsModel.entities>) => {
  dbTest(verse);
};
