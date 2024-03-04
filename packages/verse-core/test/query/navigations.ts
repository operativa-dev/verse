import { test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { entity, int, many, one, string } from "../../src/model/builder.js";
import { Verse } from "../../src/verse.js";
import { dataTest, fixture } from "../infra.js";

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

export class Track {
  constructor(
    readonly trackId: number,
    readonly name: string,
    readonly albumId: number,
    readonly genreId: number,
    readonly composer: string,
    readonly genre: Genre,
    readonly album: Album
  ) {}
}

export class Genre {
  constructor(
    readonly genreId: number,
    readonly name: string
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

  tracks: entity(Track, {
    trackId: int(),
    name: string(),
    albumId: int(),
    genreId: int(),
    composer: string({ nullable: true }),
    genre: one(Genre),
    album: one(Album),
  }),

  genres: entity(Genre, {
    genreId: int(),
    name: string(),
  }),
};

export const navsFixture = (driver: Driver) => {
  return fixture(driver, navsModel);
};

export const navsTests = (verse: Verse<typeof navsModel>) => {
  const snap = dataTest(verse);

  test("select many", async () => {
    const q = verse.from.artists.select(a => a.albums);

    await snap(q);
  });

  test("where many length", async () => {
    const q = verse.from.artists.where(a => a.albums.length > 1);

    await snap(q);
  });

  test("is null", async () => {
    const q = verse.from.albums.where(a => a.artist === null);

    await snap(q);
  });

  test("is not null", async () => {
    const q = verse.from.tracks.where(t => t.album.artist !== null);

    await snap(q);
  });

  if (verse.metadata.config.driver.info.name !== "mssql") {
    test("group by", async () => {
      const q = verse.from.tracks
        .groupBy(
          t => t.albumId,
          g => g.array(t => t.album)
        )
        .toArray();

      await snap(q);
    });
  }

  test("select two levels", async () => {
    const q = verse.from.tracks.select(t => t.album.artist.name);

    await snap(q);
  });

  test("where two levels", async () => {
    const q = verse.from.tracks.where(t => t.album.artist.name === "Alice In Chains");

    await snap(q);
  });

  test("after join", async () => {
    const q = verse.from.tracks
      .join(Album, (t, a) => t.albumId === a.albumId)
      .where(t => t[1].artist.name === "Alice In Chains");

    await snap(q);
  });

  test("one where select", async () => {
    const q = verse.from.albums
      .where(al => al.artist.name === "Alice In Chains")
      .select(al => al.artist.name);

    await snap(q);
  });

  test("one where", async () => {
    const q = verse.from.albums.where(a => a.artist.name === "Alice In Chains");

    await snap(q);
  });

  test("one where after projection array", async () => {
    const q = verse.from.albums
      .select(a => [a])
      .where(o => o[0]!.artist.name === "Alice In Chains");

    await snap(q);
  });

  test("one select", async () => {
    const q = verse.from.albums.select(a => a.artist);

    await snap(q);
  });

  test("after join destructure", async () => {
    const q = verse.from.tracks
      .join(Album, (t, a) => t.albumId === a.albumId)
      .where(([_, a]) => a.artist.name === "Alice In Chains")
      .toArray();

    await snap(q);
  });

  test("one where after projection deep complex", async () => {
    const q = verse.from.albums
      .select(a => ({ foo: { bar: a }, baz: a }))
      .where(o => o.foo.bar.artist.name === "Alice In Chains");

    await snap(q);
  });

  test("one where after projection deep", async () => {
    const q = verse.from.albums
      .select(a => ({ foo: { bar: a } }))
      .where(o => o.foo.bar.artist.name === "Alice In Chains");

    await snap(q);
  });

  test("one where after projection array", async () => {
    const q = verse.from.albums
      .select(a => [a])
      .where(o => o[0]!.artist.name === "Alice In Chains");

    await snap(q);
  });

  test("one where after projection", async () => {
    const q = verse.from.albums
      .select(a => ({ foo: a }))
      .where(o => o.foo.artist.name === "Alice In Chains");

    await snap(q);
  });

  test("one where select scalar", async () => {
    const q = verse.from.albums
      .where(a => a.artist.name === "Alice In Chains")
      .select(a => a.title);

    await snap(q);
  });

  test("one where select where", async () => {
    const q = verse.from.albums
      .where(al => al.artist.name === "Alice In Chains")
      .select(al => al.artist.name)
      .where(n => n === "Alice In Chains");

    await snap(q);
  });

  test("one select", async () => {
    const q = verse.from.albums.select(a => a.artist);

    await snap(q);
  });

  test("one select tuple", async () => {
    const q = verse.from.albums.select(a => [a.artist, a.artistId]);

    await snap(q);
  });

  test("one select twice", async () => {
    const q = verse.from.albums.select(a => [a.artist, a.artist]);

    await snap(q);
  });

  test("one select tuple binary", async () => {
    const q = verse.from.albums.select(a => [a, a.artist, a.artistId + 1]);

    await snap(q);
  });

  test("one orderby", async () => {
    const q = verse.from.albums.orderBy(a => a.artist.name);

    await snap(q);
  });

  test("one select mixed", async () => {
    const q = verse.from.albums.select(a => [a.artist, a.title]);

    await snap(q);
  });

  test("one select where deep", async () => {
    const q = verse.from.albums
      .select(al => ({ al }))
      .where(o => o.al.artist.name === "Alice In Chains")
      .select(o => o.al.artist.name);

    await snap(q);
  });

  test("one select entity and scalar", async () => {
    const q = verse.from.albums.select(a => [a.artist, a.artist.name]);

    await snap(q);
  });
};
