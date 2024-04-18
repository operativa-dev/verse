// noinspection JSUnusedGlobalSymbols

import { expect, test } from "vitest";
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
    readonly artist: Artist,
    readonly tracks: Track[]
  ) {}
}

export class Track {
  constructor(
    readonly trackId: number,
    readonly name: string,
    readonly albumId: number,
    readonly genreId: number,
    readonly composer: string,
    readonly playlistTracks: PlaylistTrack[],
    readonly genre: Genre,
    readonly album: Album
  ) {}
}

export class PlaylistTrack {
  constructor(
    readonly playlistId: number,
    readonly trackId: number
  ) {}
}

export class Genre {
  constructor(
    readonly genreId: number,
    readonly name: string,
    readonly tracks: Track[]
  ) {}
}

const withModel = {
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
    tracks: many(Track, { orderBy: t => t.trackId }),
  }),

  tracks: entity(Track, {
    trackId: int(),
    name: string(),
    albumId: int(),
    genreId: int(),
    composer: string({ nullable: true }),
    playlistTracks: many(PlaylistTrack),
    genre: one(Genre),
    album: one(Album),
  }),

  playlistTracks: entity(
    PlaylistTrack,
    {
      playlistId: int(),
      trackId: int(),
    },
    pt => {
      pt.key("playlistId", "trackId");
    }
  ),

  genres: entity(Genre, {
    genreId: int(),
    name: string(),
    tracks: many(Track),
  }),
};

export const withFixture = (driver: Driver) => {
  return fixture(driver, withModel);
};

export const withTests = (verse: Verse<typeof withModel>) => {
  const snap = dataTest(verse);

  test("groupBy no result selector", async () => {
    const q = verse.from.albums.groupBy(a => a.artistId);

    await snap(q);
  });

  test("groupBy no result selector compiled", async () => {
    const q = verse.compile(from => from.albums.groupBy(a => a.artistId));

    await snap(q());
  });

  test("groupBy identity array result", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => ({ items: g.array(a => a) })
    );

    await snap(q);
  });

  test("groupBy no-args array result", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => [g.array()]
    );

    await snap(q);
  });

  test("groupBy array aggregate with key", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => [a.artistId, a.name],
        g => [g.key[1], g.array((_, al) => [al.title, al.albumId])]
      );

    await snap(q);
  });

  test("groupBy array aggregate", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => al.title)
      );

    await snap(q);
  });

  test("groupBy array aggregate tuple", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => ({ id: a.artistId, name: a.name }),
        g => [g.key.name, g.array((_, al) => [al.title, al.albumId])]
      );

    await snap(q);
  });

  test("groupBy array aggregate tuple with key", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => [g.key, g.array((_, al) => [al.title, al.albumId])]
      );

    await snap(q);
  });

  test("groupBy array entity", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => [g.key, g.array((_, al) => al)]
      );

    await snap(q);
  });

  test("groupBy array of entities", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((a, al) => [al, a])
      );

    await snap(q);
  });

  test("groupBy array literal object", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => ({ foo: al.title, bar: al.albumId }))
      );

    await snap(q);
  });

  test("nested arrays and objects", async () => {
    const q = verse.from.artists
      .select(a => [a])
      .select(b => ({
        foo: b,
      }))
      .select(a => [[a]]);

    await snap(q);
  });

  test("nested arrays and objects number", async () => {
    const q = verse.from.artists
      .select(a => [a])
      .select(_ => ({
        foo: 12,
      }));

    await snap(q);
  });

  test("nested arrays and objects boolean", async () => {
    const q = verse.from.artists
      .select(a => [a])
      .select(_ => ({
        foo: true,
      }));

    await snap(q);
  });

  test("nested arrays and objects null", async () => {
    const q = verse.from.artists
      .select(a => [a])
      .select(_ => ({
        foo: null,
      }));

    await snap(q);
  });

  test("nested arrays and objects undefined", async () => {
    const q = verse.from.artists.select(_ => undefined);

    await snap(q);
  });

  test("nested arrays and objects undefined object", async () => {
    const q = verse.from.artists.select(_ => ({ foo: undefined }));

    await snap(q);
  });

  test("nested arrays and objects parameter", async () => {
    const q = verse.compile((from, $foo: number) =>
      from.artists
        .select(a => [a])
        .select(_ => ({
          foo: $foo,
        }))
    );

    await snap(q(42));
  });

  test("nested arrays and objects negation", async () => {
    const q = verse.from.artists
      .select(_ => [12])
      .select(b => ({
        foo: -b[0]!,
      }));

    await snap(q);
  });

  test("nested arrays and objects string", async () => {
    const q = verse.from.artists
      .select(a => [a])
      .select(_ => ({
        foo: "bob",
      }));

    await snap(q);
  });

  test("groupBy array select", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => al)
      );

    await snap(q);
  });

  test("groupBy array select identity", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => al)
      )
      .select(als => als);

    await snap(q);
  });

  test("groupBy array select nested", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => al)
      )
      .select(als => als)
      .select(a => [a])
      .select(b => ({ foo: b }));

    await snap(q);
  });

  test("groupBy array select object duplicate", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => ({ a: al, b: al }))
      );

    await snap(q);
  });

  test("groupBy array aggregate where like", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => al.title)
      )
      .where(t => t[0]!.like("T%"));

    await snap(q);
  });

  test("groupBy array aggregate not string", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => al.artistId)
      )
      .where(t => t[0]! > 10);

    await snap(q);
  });

  test("groupBy array aggregate array not string", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => [al.artistId])
      )
      .where(t => t[0]![0]! > 10);

    await snap(q);
  });

  test("groupBy array aggregate entity where", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => al)
      )
      .where(t => t[0]!.title.like("T%"));

    await snap(q);
  });

  test("groupBy array aggregate entity object where", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => ({ key: al }))
      )
      .where(o => o[1]!.key.title.like("T%"));

    await snap(q);
  });

  test("groupBy array aggregate entity object where numeric", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => ({ key: [al] }))
      )
      .where(o => o[1]!.key[0]!.albumId > 10);

    await snap(q);
  });

  test("groupBy array entity with key", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => [g.key, g.array((_, al) => al)]
      );

    await snap(q);
  });

  test("array top level single property", async () => {
    const q = verse.compile(from => from.artists.select(a => a.name).array());

    await snap(q());
  });

  test("array top level single property select identity", async () => {
    const q = verse.compile(from =>
      from.artists
        .select(a => a.name)
        .array()
        .select(a => a)
    );

    await snap(q());
  });

  test("array top level single property select indexer", async () => {
    const q = verse.compile(from =>
      from.artists
        .select(a => a.name)
        .array()
        .select(a => a[0])
    );

    await snap(q());
  });

  test("array top level single entity select indexer", async () => {
    const q = verse.compile(from =>
      from.artists
        .select(a => a)
        .array()
        .select(a => a[0])
    );

    await snap(q());
  });

  test("array top level single property array", async () => {
    const q = verse.compile(from => from.artists.select(a => [a.name]).array());

    await snap(q());
  });

  test("array top level single property object", async () => {
    const q = verse.compile(from => from.artists.select(a => ({ foo: a.name })).array());

    await snap(q());
  });

  test("where object", async () => {
    const q = verse.compile(from => from.artists.where(a => ({ a }).a.artistId === 1));

    await snap(q());
  });

  test("select object select identity", async () => {
    const q = verse.compile(from => from.artists.select(a => ({ a })).select(a => a.a));

    await snap(q());
  });

  test("select array select identity", async () => {
    const q = verse.compile(from => from.artists.select(a => [a]).select(a => a[0]));

    await snap(q());
  });

  test("select object where identity", async () => {
    const q = verse.compile(from =>
      from.artists.select(a => ({ a })).where(a => a.a.artistId === 1)
    );

    await snap(q());
  });

  test("select array where identity", async () => {
    const q = verse.compile(from => from.artists.select(a => [a]).where(a => a[0]!.artistId === 1));

    await snap(q());
  });

  test("sub-query projection scalar first", async () => {
    const q = verse.compile(from =>
      from.artists.select(_ =>
        from.albums
          .where(a => a.title.like("T%"))
          .select(al => al.title)
          .maybeFirst()
      )
    );

    await snap(q());
  });

  test("sub-query projection scalar first object", async () => {
    const q = verse.compile(from =>
      from.artists.select(a => ({
        foo: from.albums.select(al => al.title).maybeFirst(),
        bar: a.name,
      }))
    );

    await snap(q());
  });

  test("sub-query projection scalar first array", async () => {
    const q = verse.compile(from =>
      from.artists.select(a => [from.albums.select(al => al.title).maybeFirst(), a.name])
    );

    await snap(q());
  });

  test("sub-query projection scalar first where", async () => {
    const q = verse.compile(from =>
      from.artists.where(a => from.albums.select(al => al.title).maybeFirst() === a.name)
    );

    await snap(q());
  });

  test("groupBy array select indexer", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => al)
      )
      .select(als => als[0]);

    await snap(q);
  });

  test("groupBy array select indexer select number", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => al)
      )
      .select(als => als[0]!)
      .select(a => a.albumId)
      .select(t => t * 2)
      .select(t => t);

    await snap(q);
  });

  test("groupBy array select indexer select string", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => g.array((_, al) => al)
      )
      .select(als => als[0]!)
      .select(a => a.title)
      .where(t => t.like("T%"))
      .select(t => t);

    await snap(q);
  });

  test("array top level complex projection where", async () => {
    const q = verse.compile(from =>
      from.artists
        .select(a => a)
        .array()
        .select(a => ({ b: a[0]!.name }))
        .where(a => a.b === "AC/DC")
    );

    await snap(q());
  });

  test("sub-query projection array", async () => {
    const q = verse.compile(from =>
      from.artists.select(_ =>
        from.albums
          .where(a => a.title.like("T%"))
          .select(al => al.title)
          .array()
      )
    );

    await snap(q());
  });

  if (verse.config.driver.info.name !== "oracle") {
    test("sub-query projection array index", async () => {
      const q = verse.compile(from =>
        from.artists.select(_ =>
          from.albums
            .where(a => a.title.like("T%"))
            .select(al => al.title)
            .limit(5)
            .array()
            .select(a => a[0])
            .orderBy(a => a)
        )
      );

      await snap(q());
    });
  }

  test("sub-query projection array entity", async () => {
    const q = verse.compile(from =>
      from.artists
        .limit(5)
        .select(ar => [ar, from.albums.where(al => ar.artistId === al.artistId).array()])
    );

    await snap(q());
  });

  test("sub-query projection correlated select scalar outside", async () => {
    const q = verse.compile(from =>
      from.artists.select(a => [
        a.name,
        from.albums.where(al => a.artistId === al.artistId).maybeFirst()?.title,
      ])
    );

    await snap(q());
  });

  test("sub-query projection correlated select scalar inside", async () => {
    const q = verse.compile(from =>
      from.artists.select(a => [
        a.name,
        from.albums
          .where(al => a.artistId === al.artistId)
          .select(al => al.title)
          .maybeFirst(),
      ])
    );

    await snap(q());
  });

  test("sub-query correlated where first outside", async () => {
    const q = verse.compile(from =>
      from.artists.where(
        a =>
          a.artistId === from.albums.where(al => a.artistId === al.artistId).maybeFirst()?.artistId
      )
    );

    await snap(q());
  });

  test("sub-query correlated where first outside non-compiled", async () => {
    const q = verse.from.artists.where(
      (a, from) =>
        a.artistId === from.albums.where(al => a.artistId === al.artistId).maybeFirst()?.artistId
    );

    await snap(q);
  });

  test("sub-query correlated where first inside", async () => {
    const q = verse.compile(from =>
      from.artists.where(
        a =>
          a.artistId ===
          from.albums
            .where(al => a.artistId === al.artistId)
            .select(al => al.artistId)
            .maybeFirst()
      )
    );

    await snap(q());
  });

  test("sub-query correlated where single", async () => {
    const q = verse.compile(from =>
      from.artists.where(
        a =>
          a.artistId ===
          from.albums
            .where(al => a.artistId === al.artistId && a.name === "Buddy Guy")
            .maybeSingle()?.artistId
      )
    );

    await snap(q());
  });

  test("sub-query projection array correlated", async () => {
    const q = verse.compile(from =>
      from.artists.select(a => from.albums.where(al => a.artistId === al.artistId).array())
    );

    await snap(q());
  });

  test("array indexed", async () => {
    const q = verse.compile(from =>
      from.artists
        .limit(1)
        .array()
        .select(a => a[0])
    );

    await snap(q());
  });

  test("groupBy array entity", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => [g.key, g.array((_, al) => al)]
      );

    await snap(q);
  });

  test("groupBy array entity 2", async () => {
    const q = verse.from.artists
      .leftJoin(Album, (a, al) => a.artistId === al.artistId)
      .groupBy(
        (a, _) => a.artistId,
        g => [g.key, g.array((a, al) => [a, al, 42, al.title])]
      );

    await snap(q);
  });

  test("array indexed select", async () => {
    const q = verse.compile(from => from.artists.array().select(a => [a[0]!.name, a]));

    await snap(q());
  });

  test("array indexed select complex shaper", async () => {
    const q = verse.compile(from =>
      from.artists.array().select(a => [a[0]!.name, a[1], { foo: a[2] }])
    );

    await snap(q());
  });

  test("array indexed select complex shaper 2", async () => {
    const q = verse.compile(from =>
      from.artists
        .array()
        .select(a => a[0]!)
        .select(a => [a, a.name, a, a.artistId])
    );

    await snap(q());
  });

  test("select albums for artists", async () => {
    const q = verse.compile(from =>
      from.artists
        .select(a => [a, [from.albums.where(al => a.artistId === al.artistId).array()]])
        .limit(5)
    );

    await snap(q());
  });

  test("sub-query projection", async () => {
    const q = verse.compile(from => from.artists.select(_ => from.albums.maybeFirst()));

    await snap(q());
  });

  test("sub-query projection array correlated indexed", async () => {
    const q = verse.compile(from =>
      from.artists.select(a =>
        from.albums
          .where(al => a.artistId === al.artistId)
          .array()
          .select(a => [a[0], a[1]])
      )
    );

    await snap(q());
  });

  test("sub-query projection correlated select entity", async () => {
    const q = verse.compile(from =>
      from.artists.select(a => [
        a.name,
        from.albums.where(al => a.artistId === al.artistId).maybeFirst(),
      ])
    );

    await snap(q());
  });

  test("self join", async () => {
    const q = verse.compile(from =>
      from.artists
        .limit(5)
        .join(from.artists, (a1, a2) => a1.artistId === a2.artistId)
        .select((a1, a2) => [a1.artistId, a2.name])
    );

    await snap(q());
  });

  test("self join sub-query", async () => {
    const q = verse.compile(from =>
      from.artists.limit(5).join(
        from.artists.orderBy(a2 => a2.artistId),
        (a1, a2) => a1.artistId === a2.artistId
      )
    );

    await snap(q());
  });

  test("self left join", async () => {
    const q = verse.compile(from =>
      from.artists
        .limit(5)
        .leftJoin(from.artists, (a1, a2) => a1.artistId === a2.artistId)
        .select((a1, a2) => [a1.artistId, a2.name])
    );

    await snap(q());
  });

  test("self left join sub-query", async () => {
    const q = verse.compile(from =>
      from.artists.limit(5).leftJoin(
        from.artists.orderBy(a2 => a2.artistId),
        (a1, a2) => a1.artistId === a2.artistId
      )
    );

    await snap(q());
  });

  test("join composable", async () => {
    const artists = verse.from.artists.select(a => [a]);

    const q = verse.from.artists
      .limit(5)
      .join(artists, (a1, a2) => a1.artistId === a2[0]!.artistId)
      .select((a1, a2) => [a1.artistId, a2![0]!.name]);

    await snap(q);
  });

  test("join multiple", async () => {
    const q = verse.from.tracks
      .join(Album, (tr, al) => tr.albumId === al.albumId)
      .join(Genre, (tr, _, g) => tr.genreId === g.genreId);

    await snap(q);
  });

  test("demo sub-query with json", async () => {
    const q = verse.compile((from, $pattern: string) =>
      from.artists.limit(10).select(a => [
        a,
        from.albums
          .where(al => al.artistId === a.artistId)
          .array()
          .where(al => al[0]!.title.like($pattern))
          .select(al => al[0]!.title),
      ])
    );

    await snap(q("B%"));
  });

  test("albums -> tracks", async () => {
    const q = verse.from.albums.with(a => a.tracks);

    await snap(q);
  });

  test("artists -> albums - order limit select", async () => {
    const q = verse.from.artists
      .with(a => a.albums)
      .orderBy(a => a.name)
      .limit(50)
      .select(a => [42, a, "abc"]);

    await snap(q);
  });

  test("eager load rhs of join", async () => {
    const q = verse.compile(from =>
      from.artists
        .leftJoin(
          from.albums.with(al => al.tracks),
          (l, r) => l.artistId === r.artistId
        )
        .limit(5)
    );

    await snap(q());
  });

  test("artist -> albums -> tracks", async () => {
    const q = verse.compile(from => from.artists.with(a => a.albums.with(a => a.tracks)).limit(5));

    await snap(q());
  });

  test("artist -> album -> tracks -> playlistTracks", async () => {
    const q = verse.compile(from =>
      from.artists.with(a => a.albums.with(a => a.tracks.with(t => t.playlistTracks))).limit(5)
    );

    await snap(q());
  });

  test("artist -> album -> tracks orderBy", async () => {
    const q = verse.compile(from =>
      from.artists
        .with(a => a.albums.with(a => a.tracks))
        .orderBy(a => a.name)
        .limit(3)
    );

    await snap(q());
  });

  test("artist -> album -> tracks -> playlistTracks - no albums", async () => {
    const q = verse.compile(from =>
      from.artists
        .with(a => a.albums.with(a => a.tracks.with(t => t.playlistTracks)))
        .where(a => a.artistId === 25)
    );

    await snap(q());
  });

  test("artist -> albums", async () => {
    const q = verse.from.artists.with(a => a.albums).limit(5);

    await snap(q);
  });

  test("album -> artist ordered", async () => {
    const q = verse.from.albums
      .orderBy(a => a.title)
      .with(a => a.artist)
      .limit(5);

    await snap(q);
  });

  test("album -> tracks -> genre", async () => {
    const q = verse.from.albums
      .with(a => a.tracks.with(t => t.genre))
      .orderBy(a => a.title)
      .limit(5);

    await snap(q);
  });

  test("track -> album -> artist", async () => {
    const q = verse.from.tracks
      .with(t => t.album.artist)
      .orderBy(t => t.composer)
      .limit(3);

    await snap(q);
  });

  test("genre -> tracks -> album", async () => {
    const q = verse.from.genres
      .with(a => a.tracks.with(t => t.album))
      .where(g => g.name === "Jazz");

    await snap(q);
  });

  test("track -> album -> artist -> albums", async () => {
    const q = verse.from.tracks.with(a => a.album.artist.albums).limit(10);

    await snap(q);
  });

  test("track -> album, genre", async () => {
    const q = verse.from.tracks
      .with(a => a.album)
      .with(a => a.genre)
      .limit(10);

    await snap(q);
  });

  test("track -> album -> artist, genre", async () => {
    const q = verse.from.tracks
      .with(a => a.album.artist)
      .with(a => a.genre)
      .limit(10);

    await snap(q);
  });
};

export const withErrorTests = (verse: Verse<typeof withModel>) => {
  test("artist -> album single", async () => {
    const q = verse.compile(from =>
      from.artists
        .with(a => a.albums)
        .orderBy(a => a.name)
        .single()
    );

    await expect(() => q()).rejects.toThrow("Query produced more than one result (expected 1).");
  });

  test("artist -> album -> tracks single", async () => {
    const q = verse.compile(from =>
      from.artists
        .with(a => a.albums.with(a => a.tracks))
        .orderBy(a => a.name)
        .single()
    );

    await expect(() => q()).rejects.toThrow("Query produced more than one result (expected 1).");
  });

  test("groupBy identity grouping", async () => {
    expect(() => {
      verse.from.albums
        .groupBy(
          a => a.artistId,
          g => g
        )
        .toArray();
    }).toThrow(
      "Unable to compile the identity 'groupBy' result expression: '(g) => g'. " +
        "Use the 'groupBy' overload that omits the result expression."
    );
  });
};
