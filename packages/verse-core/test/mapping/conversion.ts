import { v4 as uuidv4 } from "uuid";
import { expect, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { boolean, date, entity, number } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dbTest, fixture } from "../infra.js";

export class Entity {
  constructor(
    public num: number,
    public bool?: boolean,
    public date?: Date
  ) {}
}

const conversionModel = {
  entities: {
    entities: entity(
      Entity,
      {
        num: number({
          type: "varchar(2)",
          convert: {
            read: (v: string) => Number.parseInt(v),
            write: (v: number) => String(v),
          },
        }),
        bool: boolean({ nullable: true }), // by convention on mysql, sqlite etc
        date: date({ nullable: true }),
      },
      c => {
        c.key("num");
      }
    ),
  },
};

export const conversionFixture = (driver: Driver) => {
  return fixture(driver, conversionModel);
};

export const conversionTests = (verse: Verse<typeof conversionModel.entities>) => {
  dbTest(verse);

  test("select booleans", async () => {
    const e = new Entity(41, true);

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const uuid = uuidv4();

    const result = await verse.from.entities
      .where((e, $num) => e.num === $num && e.bool!, 41)
      .select(
        (e, $uuid, $b) => [
          true,
          false,
          e.bool,
          undefined,
          null,
          $uuid,
          new Date("1976-10-11 12:13:14+02"),
          $b,
        ],
        uuid,
        true
      )
      .where((e, $b) => e[0] === $b && e[2] === true, true)
      .single();

    expect(result).toStrictEqual([
      true,
      false,
      true,
      undefined,
      undefined,
      uuid,
      "1976-10-11T10:13:14.000Z",
      true,
    ]);
  });

  test("number to string parameter and boolean true", async () => {
    const e = new Entity(42, true);

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const dbEntity = await verse.from.entities
      .where((e, $num) => e.num === $num && e.bool!, 42)
      .single();

    expect(dbEntity).not.toBe(e);
    expect(dbEntity).toStrictEqual(e);
  });

  test("nullable boolean false", async () => {
    const e = new Entity(69, false);

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const dbEntity = await verse.from.entities.where(e => e.num === 69 && !e.bool).single();

    expect(dbEntity).not.toBe(e);
    expect(dbEntity).toStrictEqual(e);
  });

  test("nullable boolean true", async () => {
    const e = new Entity(77, true);

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const dbEntity = await verse.from.entities.where(e => e.num === 77 && e.bool!).single();

    expect(dbEntity).not.toBe(e);
    expect(dbEntity).toStrictEqual(e);
  });

  test("nullable boolean === true", async () => {
    const e = new Entity(78, true);

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const dbEntity = await verse.from.entities.where(e => e.num === 78 && e.bool === true).single();

    expect(dbEntity).not.toBe(e);
    expect(dbEntity).toStrictEqual(e);
  });

  test("nullable boolean null", async () => {
    const e = new Entity(99);

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const dbEntity = await verse.from.entities.where(e => e.num === 99 && e.bool === null).single();

    expect(dbEntity).not.toBe(e);
    expect(dbEntity).toEqual(e);
  });

  test("nullable boolean undefined", async () => {
    const e = new Entity(23);

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const dbEntity = await verse.from.entities
      .where(e => e.num === 23 && e.bool === undefined)
      .single();

    expect(dbEntity).not.toBe(e);
    expect(dbEntity).toEqual(e);
  });

  test("literal conversion flipped", async () => {
    const e = new Entity(81, true);

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const dbEntity = await verse.from.entities.where(e => 81 === e.num).single();

    expect(dbEntity).not.toBe(e);
    expect(dbEntity).toStrictEqual(e);
  });

  test("date", async () => {
    const e = new Entity(61, undefined, new Date("1976-10-11 12:13:14+02"));

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const dbEntity = await verse.from.entities.where((e, $num) => e.num === $num, 61).single();

    expect(dbEntity).not.toBe(e);
    expect(dbEntity).toStrictEqual(e);
  });

  test("date eq comparison parameter", async () => {
    const e = new Entity(62, undefined, new Date("1979-10-12 12:13:14+02"));

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const dbEntity = await verse.from.entities
      .where((e, $date) => e.date === $date, new Date("1979-10-12 12:13:14+02"))
      .single();

    expect(dbEntity).not.toBe(e);
    expect(dbEntity).toStrictEqual(e);
  });

  test("date eq comparison inline", async () => {
    const e = new Entity(63, undefined, new Date("1979-10-12 12:13:14+02"));

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const dbEntity = await verse.from.entities
      .where(e => e.num === 63 && e.date === new Date("1979-10-12 12:13:14+02"))
      .single();

    expect(dbEntity).not.toBe(e);
    expect(dbEntity).toStrictEqual(e);
  });

  test("date gt comparison inline", async () => {
    const e = new Entity(64, undefined, new Date("1979-10-12 12:13:14+02"));

    const uow = verse.uow();

    await uow.entities.add(e);

    await uow.commit();

    const dbEntity = await verse.from.entities
      .where(e => e.num === 64 && e.date! > new Date("1978-10-12"))
      .single();

    expect(dbEntity).not.toBe(e);
    expect(dbEntity).toStrictEqual(e);
  });
};
