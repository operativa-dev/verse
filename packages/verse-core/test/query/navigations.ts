import { test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { entity, int, many, one, string } from "../../src/model/builder.js";
import { AsyncSequence } from "../../src/query/queryable.js";
import { Verse } from "../../src/verse.js";
import { fixture, isAsyncSequence } from "../infra.js";

export class Artist {
  constructor(
    readonly artistId: number,
    readonly name: string,
    readonly albums: Album[]
  ) {}
}

export class Album {
  constructor(
    readonly albumId: number,
    readonly title: string,
    readonly artistId: number,
    readonly artist: Artist
  ) {}
}

const navsModel = {
  artists: entity(Artist, {
    artistId: int(),
    name: string(),
    albums: many(Album),
  }),

  albums: entity(Album, {
    albumId: int(),
    title: string(),
    artistId: int(),
    artist: one(Artist),
  }),
};

export const navsFixture = (driver: Driver) => {
  return fixture(driver, navsModel);
};

export const navsTests = (verse: Verse<typeof navsModel>) => {
  //const snap = dataTest(verse);

  // test("one where", async () => {
  //   const q = verse.from.albums.where(a => a.artist.name === "Alice In Chains");
  //
  //   //await snap(q);
  //
  //   // const q = verse.compile(from =>
  //   //   from.albums
  //   //     .join(Artist, (al, ar) => al.artistId === ar.artistId)
  //   //     .where(([_, ar]) => ar.name === "Alice In Chains")
  //   // );
  //
  //   await dump(q);
  // });

  test("one select", async () => {
    // const q = verse.from.albums.select(a => a.artist);

    //await snap(q);

    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select(([_, ar]) => ar);

    await dump(q);
  });

  test("one select aliasing", async () => {
    // const q = verse.from.albums.select(a => a.artist);

    //await snap(q);

    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select(([_, ar]) => [ar, ar.artistId]);

    await dump(q);
  });

  test("one select aliasing binary", async () => {
    // const q = verse.from.albums.select(a => a.artist);

    //await snap(q);

    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select(([_, ar]) => [ar, ar.artistId + 1]);

    await dump(q);
  });

  test("one orderby aliasing", async () => {
    // const q = verse.from.albums.select(a => a.artist);

    //await snap(q);

    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .orderBy(([_, ar]) => ar.artistId);

    await dump(q);
  });

  test("one select scalar", async () => {
    //const q = verse.from.albums.select(a => a.artist.name);

    //await snap(q);

    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select(([_, ar]) => ar.name);

    await dump(q);
  });

  test("one select mixed", async () => {
    // const q = verse.from.albums.select(a => [a.artist, a.title]);

    //await snap(q);

    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select(([al, ar]) => [ar, al.title]);

    await dump(q);
  });

  test("one where select", async () => {
    // const q = verse.from.albums
    //   .where(al => al.artist.name === "Alice In Chains")
    //   .select(al => al.artist.name);

    //await snap(q);

    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .where(([_, ar]) => ar.name === "Alice In Chains")
      .join(Artist, ([al, _], ar) => al.artistId === ar.artistId)
      .select(([_, ar]) => ar.name);

    await dump(q);
  });

  test("one select where deep", async () => {
    // const q = verse.from.albums
    //   .select(al => ({ al }))
    //   .where(o => o.al.artist.name === "Alice In Chains")
    //   .select(o => o.al.artist.name);

    //await snap(q);

    const q = verse.from.albums
      .select(al => ({ al }))
      .join(Artist, (o, ar) => o.al.artistId === ar.artistId)
      .where(([_, ar]) => ar.name === "Alice In Chains")
      .select(([_, ar]) => ar.name);

    await dump(q);
  });

  test("one select entity and scalar", async () => {
    //const q = verse.from.albums.select(a => a.artist.name);

    //await snap(q);

    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select(([_, ar]) => [ar, ar.name]);

    await dump(q);
  });

  test("one orderBy scalar", async () => {
    //const q = verse.from.albums.orderBy(a => a.artist.name);

    //await snap(q);

    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .orderBy(([_, ar]) => ar.name);

    await dump(q);
  });
};

export async function dump(query: Promise<unknown> | AsyncSequence<unknown>) {
  const results = isAsyncSequence(query) ? await query.toArray() : [await query];

  console.log("\nResults:\n");
  console.log(JSON.stringify(results, null, 2));
  console.log();
}
