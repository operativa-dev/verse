import { expect, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { entity, int, string } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dataTest, fixture } from "../infra.js";

export class Album {
  constructor(
    readonly albumId: number,
    readonly title: string,
    readonly artistId: number
  ) {}
}

const rawModel = {
  albums: entity(Album, {
    albumId: int(),
    title: string(),
    artistId: int(),
  }),
};

export const rawFixture = (driver: Driver) => {
  return fixture(driver, rawModel);
};

export const rawTests = (verse: Verse<typeof rawModel>) => {
  const snap = dataTest(verse);

  test("identity", async () => {
    const q = verse.from.albums.sql`select * from "Album"`;

    await snap(q);
  });

  test("identity uow", async () => {
    const q = verse.uow().albums.sql`select * from "Album"`;

    await snap(q);
  });

  test("parameter", async () => {
    const q = verse.from.albums.sql`select * from "Album" where "AlbumId" = ${1}`;

    await snap(q);
  });

  test("parameter local", async () => {
    const id = 1;

    const q = verse.from.albums.sql`select * from "Album" where "AlbumId" = ${id}`;

    await snap(q);
  });

  test("parameter compose parameter", async () => {
    const q = verse.from.albums.sql`SELECT * FROM "Album" WHERE "AlbumId" = ${157}`.where(
      (a, $title) => a.title === $title,
      "Miles Ahead"
    );

    await snap(q);
  });

  test("compiled", async () => {
    const q = verse.compile((from, $title, $id) =>
      from.albums.sql`SELECT * FROM "Album" WHERE "AlbumId" = ${$id}`.where(a => a.title === $title)
    );

    await snap(q("Miles Ahead", 157));
  });

  test("compiled uow", async () => {
    const q = verse.compileUow((from, $title, $id) =>
      from.albums.sql`SELECT * FROM "Album" WHERE "AlbumId" = ${$id}`.where(a => a.title === $title)
    );

    await snap(q(verse.uow(), "Miles Ahead", 157));
  });

  test("compiled literal params", async () => {
    const q = verse.compile((from, $title) =>
      from.albums.sql`SELECT * FROM "Album" WHERE "AlbumId" = ${157}`.where(a => a.title === $title)
    );

    await snap(q("Miles Ahead"));
  });
};

export const rawErrorTests = (verse: Verse<typeof rawModel>) => {
  test("compiled missing param", async () => {
    const $id1 = 157;

    expect(() => {
      // @ts-ignore
      verse.compile((from, $title, $id) =>
        from.albums.sql`SELECT * FROM "Album" WHERE "AlbumId" = ${$id1}`.where(
          a => a.title === $title
        )
      );
    }).toThrow(
      "Unbound identifier '$id1'. Local variables are not supported. Use parameters instead."
    );
  });

  test("compiled bad expression", async () => {
    expect(() => {
      verse.compile(from => from.albums.sql`SELECT * FROM "Album" WHERE "AlbumId" = ${{}}`);
    }).toThrow("Unsupported template parameter expression: '{}'");
  });
};
