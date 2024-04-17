import { expect, test } from "vitest";
import { Driver } from "../../src/db/driver.js";
import { entity, int, string } from "../../src/model/builder.js";
import { AsyncSequence } from "../../src/query/queryable.js";
import { Logger } from "../../src/utils/logging.js";
import { Verse } from "../../src/verse.js";
import { dataTest, fixture } from "../infra.js";

export class Album {
  constructor(
    readonly albumId: number,
    readonly title: string,
    readonly artistId: number
  ) {}
}

export class Artist {
  constructor(
    readonly artistId: number,
    readonly name: string
  ) {}
}

export class Track {
  constructor(
    readonly trackId: number,
    readonly name: string,
    readonly theAlbumId: number,
    readonly genreId: number,
    readonly composer: string | null,

    readonly album: Album
  ) {}
}

const queryModel = {
  albums: entity(Album, {
    albumId: int(),
    title: string(),
    artistId: int(),
  }),

  artists: entity(Artist, {
    artistId: int(),
    name: string(),
  }),

  tracks: entity(Track, {
    trackId: int(),
    name: string(),
    theAlbumId: int({ column: "AlbumId" }),
    genreId: int(),
    composer: string({ nullable: true }),
  }),
};

export const queryFixture = (driver: Driver, logger?: Logger) => {
  return fixture(driver, queryModel, logger);
};

export const queryTests = (verse: Verse<typeof queryModel>) => {
  const snap = dataTest(verse);

  test("count limit", async () => {
    const q = verse.from.albums.limit(7).count();

    await snap(q);
  });

  test("options compile", async () => {
    const q = verse.compile((from, $limit: number) =>
      from.albums.options({ disabledConditions: "all" }).limit($limit)
    );

    await snap(q(5));
  });

  test("sub-query with parameter not compiled scalar projection", async () => {
    const q = verse.from.artists
      .select(a => a.artistId)
      .select((ar, $limit, from) => from.albums.limit($limit).where(a => a.artistId === ar), 1);

    await snap(q);
  });

  test("sub-query with limit parameter not compiled", async () => {
    const q = verse.from.artists.select(
      (_, $limit, from) => from.albums.limit($limit).maybeFirst(),
      1
    );

    await snap(q);
  });

  test("sub-query select not compiled", async () => {
    const q = verse.from.artists.select((_, from) => from.albums.limit(1).maybeFirst());

    await snap(q);
  });

  test("select parameter", async () => {
    const q = verse.from.albums.select((a, $foo) => [a.title, $foo], "bar");

    await snap(q);
  });

  test("includes", async () => {
    const q = verse.from.albums.where(a => [1, 2].includes(a.artistId));

    await snap(q);
  });

  test("includes parameter", async () => {
    const q = verse.from.albums.where(
      (a, $title, $ids) => a.title.like($title) && $ids.includes(a.artistId),
      "B%",
      [2, 12]
    );

    await snap(q);
  });

  test("not includes", async () => {
    const q = verse.from.albums.where(a => ![1, 2].includes(a.artistId));

    await snap(q);
  });

  test("includes compiled", async () => {
    const q = verse.compile((from, $title: string, $ids: number[]) =>
      from.albums.where(a => a.title.like($title) && $ids.includes(a.artistId))
    );

    await snap(q("B%", [2, 12]));
  });

  test("identity", async () => {
    const q = verse.from.albums;

    await snap(q);
  });

  test("identity type annotation", async () => {
    const q: AsyncSequence<Album> = verse.from.albums;

    await snap(q);
  });

  test("select scalar identity", async () => {
    const q = verse.from.albums.select(a => a.title).select(t => t);

    await snap(q);
  });

  test("limit", async () => {
    const q = verse.from.albums.limit(5);

    await snap(q);
  });

  test("select template literal", async () => {
    const q: ($title: string) => AsyncSequence<string> = verse.compile((from, $title: string) =>
      from.albums.where(a => a.title == $title).select(a => `Title: ${a.title}!`)
    );

    await snap(q("Miles Ahead"));
  });

  test("empty template literal", async () => {
    const q = verse.from.albums.limit(1).select(_ => ``);

    await snap(q);
  });

  test("simple template literal", async () => {
    const q = verse.from.albums.limit(1).select(_ => `hi!`);

    await snap(q);
  });

  test("select object literal", async () => {
    const q: ($title: string) => AsyncSequence<{ msg: string; sum: number }> = verse.compile(
      (from, $title: string) =>
        from.albums
          .where(a => a.title == $title)
          .select(a => ({
            msg: `Hi ${a.title}!`,
            sum: a.artistId * 2,
          }))
    );

    await snap(q("Miles Ahead"));
  });

  test("select number literal", async () => {
    const q = verse.from.albums.limit(1).select(_ => 42);

    await snap(q);
  });

  test("select array literal", async () => {
    const q = verse.from.albums.select(a => [1, a.albumId]).limit(3);

    await snap(q);
  });

  test("order by simple", async () => {
    const q = verse.from.albums.orderBy(a => a.artistId);

    await snap(q);
  });

  test("where two parameters", async () => {
    const q: ($title: string, $albumId: number) => AsyncSequence<Album> = verse.compile(
      (from, $title: string, $albumId: number) =>
        from.albums.where(a => a.title == $title && a.albumId > $albumId)
    );

    await snap(q("Miles Ahead", 42));
  });

  test("join simple", async () => {
    const q = verse.from.albums.join(Artist, (a, ar) => a.artistId === ar.artistId);

    await snap(q as AsyncSequence<readonly [Album, Artist]>);
  });

  test("object select where", async () => {
    const q = verse.from.albums
      .select(a => ({
        foo: a.albumId,
      }))
      .where(o => o.foo == 42);

    await snap(q);
  });

  test("select array literal where", async () => {
    const q = verse.compile((from, $title: string) =>
      from.albums
        .where(a => a.title == $title)
        .select(a => [`Hi ${a.title}!`, a.artistId * 2] as const)
        .where(o => o[1] > 12)
    );

    await snap(q("Miles Ahead"));
  });

  test("distinct", async () => {
    const q = verse.from.albums.distinct();

    await snap(q);
  });

  test("order by array", async () => {
    const q = verse.from.albums.orderBy(a => [a.artistId, a.title]);

    await snap(q);
  });

  test("order by array descending", async () => {
    const q = verse.from.albums.orderByDesc(a => [a.artistId, a.title]);

    await snap(q);
  });

  test("order by ascending and descending", async () => {
    const q = verse.from.albums.orderBy(a => a.artistId).orderByDesc(a => a.title);

    await snap(q);
  });

  test("join select lhs", async () => {
    const q = verse.from.tracks
      .join(Album, (t, a) => t.theAlbumId === a.albumId)
      .select((t, _) => t.composer)
      .orderBy(t => t);

    await snap(q);
  });

  test("join three levels", async () => {
    const q = verse.from.tracks
      .join(Album, (tr, al) => tr.theAlbumId === al.albumId)
      .join(Artist, (_, al, ar) => al.artistId === ar.artistId);

    await snap(q);
  });

  test("join three levels where select", async () => {
    const q = verse.from.tracks
      .join(Album, (t, a) => t.theAlbumId === a.albumId)
      .join(Artist, (_, a, ar) => a.artistId === ar.artistId)
      .where((_, a, __) => a.title == "Miles Ahead")
      .select((t, a, ar) => ({ album: a.title, artist: ar.name, track: t.name }));

    await snap(q);
  });

  test("offset", async () => {
    const q = verse.from.albums.offset(3).limit(5);

    await snap(q);
  });

  test("any no args", async () => {
    const q = verse.from.albums.any();

    await snap(q);
  });

  test("any where", async () => {
    const q = verse.from.albums.where(a => a.title === "Miles Ahead").any();

    await snap(q);
  });

  test("any where inline", async () => {
    const q = verse.from.albums.any(a => a.title === "Miles Ahead");

    await snap(q);
  });

  test("any where inline local args", async () => {
    const q = verse.from.albums.any((a, $title: string) => a.title === $title, "Miles Ahead");

    await snap(q);
  });

  test("any where none", async () => {
    const q = verse.from.albums.where(a => a.title === "Miles").any();

    await snap(q);
  });

  test("all", async () => {
    const q = verse.from.albums.all(a => a.albumId > 0);

    await snap(q);
  });

  test("all negative", async () => {
    const q = verse.from.albums.all(a => a.albumId === 0);

    await snap(q);
  });

  test("first", async () => {
    const q = verse.from.albums.first();

    await snap(q);
  });

  test("first where inline", async () => {
    const q = verse.from.albums.first(a => a.title === "Miles Ahead");

    await snap(q);
  });

  test("first where inline local args", async () => {
    const q = verse.from.albums.first((a, $title: string) => a.title === $title, "Miles Ahead");

    await snap(q);
  });

  test("join three levels first", async () => {
    const q = verse.from.tracks
      .join(Album, (tr, al) => tr.theAlbumId === al.albumId)
      .join(Artist, (_, al, ar) => al.artistId === ar.artistId)
      .first();

    await snap(q);
  });

  test("join three levels any", async () => {
    const q = verse.from.tracks
      .join(Album, (tr, al) => tr.theAlbumId === al.albumId)
      .join(Artist, (_, al, ar) => al.artistId === ar.artistId)
      .any((_, al, __) => al.artistId === 1);

    await snap(q);
  });

  test("join three levels aggregate", async () => {
    const q = verse.from.tracks
      .join(Album, (tr, al) => tr.theAlbumId === al.albumId)
      .join(Artist, (_, al, ar) => al.artistId === ar.artistId)
      .avg((_, al, ar) => al.artistId + ar.artistId);

    await snap(q);
  });

  test("join three levels groupBy", async () => {
    const q = verse.from.tracks
      .where(t => t.theAlbumId === 42)
      .join(Album, (tr, al) => tr.theAlbumId === al.albumId)
      .join(Artist, (_, al, ar) => al.artistId === ar.artistId)
      .groupBy((_, al, __) => al.artistId);

    await snap(q);
  });

  test("maybeFirst", async () => {
    const q = verse.from.albums.maybeFirst();

    await snap(q);
  });

  test("maybeFirst where inline", async () => {
    const q = verse.from.albums.maybeFirst(a => a.title === "Miles Ahead");

    await snap(q);
  });

  test("maybeFirst where inline local args", async () => {
    const q = verse.from.albums.maybeFirst(
      (a, $title: string) => a.title === $title,
      "Miles Ahead"
    );

    await snap(q);
  });

  test("maybeFirst no result", async () => {
    const q = verse.from.albums.where(a => a.albumId == -1).maybeFirst();

    await snap(q);
  });

  test("single", async () => {
    const q = verse.from.albums.where(a => a.title == "Miles Ahead").single();

    await snap(q);
  });

  test("single compiled", async () => {
    const q: () => Promise<string> = verse.compile(from =>
      from.albums
        .where(a => a.title === "Miles Ahead")
        .select(a => `Title: ${a.title}!`)
        .single()
    );

    await snap(q());
  });

  test("single where inline", async () => {
    const q = verse.from.albums.single(a => a.title === "Miles Ahead");

    await snap(q);
  });

  test("single where inline local args", async () => {
    const q = verse.from.albums.single((a, $title: string) => a.title === $title, "Miles Ahead");

    await snap(q);
  });

  test("maybeSingle", async () => {
    const q = verse.from.albums.where(a => a.title == "Miles Ahead").maybeSingle();

    await snap(q);
  });

  test("maybeSingle where inline", async () => {
    const q = verse.from.albums.maybeSingle(a => a.title === "Miles Ahead");

    await snap(q);
  });

  test("maybeSingle where inline local args", async () => {
    const q = verse.from.albums.maybeSingle(
      (a, $title: string) => a.title === $title,
      "Miles Ahead"
    );

    await snap(q);
  });

  test("maybeSingle no result", async () => {
    const q = verse.from.albums.where(a => a.albumId == -1).maybeSingle();

    await snap(q);
  });

  test("count", async () => {
    const q = verse.from.albums.count();

    await snap(q);
  });

  test("max", async () => {
    const q = verse.from.albums.max(a => a.albumId);

    await snap(q);
  });

  test("min", async () => {
    const q = verse.from.albums.min(a => a.albumId);

    await snap(q);
  });

  test("sum", async () => {
    const q = verse.from.albums.sum(a => a.albumId);

    await snap(q);
  });

  test("avg", async () => {
    const q = verse.from.albums.avg(a => a.albumId);

    await snap(q);
  });

  test("avg no args", async () => {
    const q = verse.from.albums.select(a => a.albumId).avg();

    await snap(q);
  });

  test("avg no args indexer", async () => {
    const q = verse.from.albums
      .select(a => [a.albumId])
      .select(t => t[0])
      .avg();

    await snap(q);
  });

  test("avg no args object", async () => {
    const q = verse.from.albums
      .select(a => ({
        foo: a.albumId,
      }))
      .select(o => o.foo)
      .avg();

    await snap(q);
  });

  test("functions select substr", async () => {
    const q = verse.from.albums.select(a => a.title.substring(3));

    await snap(q);
  });

  test("functions where substr", async () => {
    const q = verse.from.albums.where(a => a.title.substring(0, 3) === "Mil");

    await snap(q);
  });

  test("functions select length", async () => {
    const q = verse.from.albums.select(a => a.title.length);

    await snap(q);
  });

  test("functions where length", async () => {
    const q = verse.from.albums.where(a => a.title.length === 8);

    await snap(q);
  });

  test("is null", async () => {
    const q = verse.from.tracks.where(t => t.composer === null);

    await snap(q);
  });

  test("is not null", async () => {
    const q = verse.from.tracks.where(t => t.composer !== null);

    await snap(q);
  });

  test("like", async () => {
    const q = verse.from.albums.where(a => a.title.like("M%"));

    await snap(q);
  });

  test("like concat", async () => {
    const q = verse.from.albums.where((a, $p) => a.title.like("%" + $p + "%"), "a");

    await snap(q);
  });

  test("not like", async () => {
    const q = verse.from.albums.where(a => !a.title.like("M%"));

    await snap(q);
  });

  test("concat", async () => {
    const q = verse.from.albums.select(_ => "a" + "b");

    await snap(q);
  });

  test("concat columns", async () => {
    const q = verse.from.albums.select(a => a.title + a.title);

    await snap(q);
  });

  test("select aliased identity member", async () => {
    const q = verse.from.albums.select(a => a.albumId * 2).select(a => a);

    await snap(q);
  });

  test("select aliased identity array", async () => {
    const q = verse.from.albums.select(a => [a.albumId * 2, a.title]).select(a => a);

    await snap(q);
  });

  test("select aliased identity object", async () => {
    const q = verse.from.albums.select(a => ({ foo: a.albumId * 2 })).select(a => a);

    await snap(q);
  });

  test("group by count", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => g.count()
    );

    await snap(q);
  });

  test("group by array sum", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => g.count()
    );

    await snap(q);
  });

  test("group by count with key", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => [g.key, g.count()]
    );

    await snap(q);
  });

  test("group by count with key select identity", async () => {
    const q = verse.from.albums
      .groupBy(
        a => a.artistId,
        g => [g.key, g.count()]
      )
      .select(g => g);

    await snap(q);
  });

  test("group by count with key select key", async () => {
    const q = verse.from.albums
      .groupBy(
        a => a.artistId,
        g => [g.key, g.count()]
      )
      .select(g => g[0]);

    await snap(q);
  });

  test("group by count with key select count where", async () => {
    const q = verse.from.albums
      .groupBy(
        a => a.artistId,
        g => [g.key, g.count()]
      )
      .select(g => ({ count: g[1]! }))
      .where(o => o.count > 10)
      .orderBy(o => o.count);

    await snap(q);
  });

  test("group by duplicate", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => [g.key, g.key]
    );

    await snap(q);
  });

  test("group by min", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => g.min(a => a.albumId)
    );

    await snap(q);
  });

  test("group by max", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => g.max(a => a.albumId)
    );

    await snap(q);
  });

  test("group by sum", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => g.sum(a => a.albumId)
    );

    await snap(q);
  });

  test("group by avg", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => g.avg(a => a.albumId)
    );

    await snap(q);
  });

  test("group by multiple aggregates", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => [g.avg(a => a.albumId), g.count()]
    );

    await snap(q);
  });

  test("group by multiple keys", async () => {
    const q = verse.from.albums.groupBy(
      a => [a.artistId, a.albumId],
      g => g.count()
    );

    await snap(q);
  });

  test("group by max binary", async () => {
    const q = verse.from.albums.groupBy(
      a => a.artistId,
      g => g.max(a => a.albumId * 2)
    );

    await snap(q);
  });

  test("optional parameter", async () => {
    const q = verse.compile((from, title?: string) =>
      from.albums.where(a => a.title.like(`%${title}%`))
    );

    await snap(q());
  });

  test("optional parameter null", async () => {
    const q = verse.compile((from, title?: string) =>
      from.albums.where(a => a.title.like(`%${title}%`))
    );

    // @ts-ignore
    await snap(q(null));
  });

  test("optional parameter undefined", async () => {
    const q = verse.compile((from, title?: string) =>
      from.albums.where(a => a.title.like(`%${title}%`))
    );

    await snap(q(undefined));
  });

  test("null semantics parameter", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => t.composer === composer)
    );

    await snap(q());
  });

  test("null semantics parameter supplied", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => t.composer === composer)
    );

    await snap(q("Miles Davis"));
  });

  test("null semantics parameter reversed", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => composer === t.composer)
    );

    await snap(q());
  });

  test("null semantics parameter not null", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => t.composer !== composer)
    );

    await snap(q());
  });

  test("null semantics parameter not null supplied", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => t.composer !== composer)
    );

    await snap(q("Miles Davis"));
  });

  test("null semantics parameter not null reversed", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => composer !== t.composer)
    );

    await snap(q());
  });

  test("null semantics function", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => t.composer?.substring(0, 5) === composer)
    );

    await snap(q());
  });

  test("null semantics function supplied", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => t.composer?.substring(0, 5) === composer)
    );

    await snap(q("Miles"));
  });

  test("null semantics function reversed", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => composer === t.composer?.substring(0, 5))
    );

    await snap(q());
  });

  test("null semantics function not null", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => t.composer?.substring(0, 5) !== composer)
    );

    await snap(q());
  });

  test("null semantics function supplied not null", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => t.composer?.substring(0, 5) !== composer)
    );

    await snap(q("Miles"));
  });

  test("null semantics function not null reversed", async () => {
    const q = verse.compile((from, composer?: string) =>
      from.tracks.where(t => composer !== t.composer?.substring(0, 5))
    );

    await snap(q());
  });

  test("null semantics equal no parameter", async () => {
    const q = verse.from.tracks.where(t => t.composer === t.composer);

    await snap(q);
  });

  test("null semantics not equal no parameter", async () => {
    const q = verse.from.tracks.where(t => t.composer !== t.composer);

    await snap(q);
  });

  test("null semantics function equal no parameter", async () => {
    const q = verse.from.tracks.where(
      t => t.composer?.substring(0, 5) === t.composer?.substring(0, 5)
    );
    await snap(q);
  });

  test("null semantics function not equal no parameter", async () => {
    const q = verse.from.tracks.where(
      t => t.composer?.substring(0, 5) !== t.composer?.substring(0, 5)
    );
    await snap(q);
  });

  test("mod", async () => {
    const q = verse.from.tracks.select(t => t.genreId % 2);

    await snap(q);
  });

  test("binary precedence 1", async () => {
    const q = verse.from.albums.where(a => a.albumId == 1 || a.albumId == 2 || a.artistId == 3);
    await snap(q);
  });

  test("binary precedence 2", async () => {
    const q = verse.from.albums.where(a => a.albumId == 1 || (a.albumId == 2 && a.artistId == 3));
    await snap(q);
  });

  test("binary precedence 3", async () => {
    const q = verse.from.albums.where(a => (a.albumId == 1 || a.albumId == 2) && a.artistId == 3);
    await snap(q);
  });

  test("negation", async () => {
    const q = verse.from.tracks.where(t => -t.genreId == -1);

    await snap(q);
  });

  test("negation complex", async () => {
    const q = verse.from.tracks.where(t => -(t.genreId + 1) == -2);

    await snap(q);
  });

  test("composition identity", async () => {
    let albums = verse.from.albums;

    await snap(albums);
  });

  test("composition callable terminating", async () => {
    const albums = verse.from.albums;
    const maxed = albums.where(a => a.albumId > 5).max(a => a.albumId);

    await snap(maxed);
  });

  test("join", async () => {
    const q = verse.from.albums.join(verse.from.artists, (a, ar) => a.artistId === ar.artistId);

    await snap(q);
  });

  test("left join simple", async () => {
    const q = verse.from.albums.leftJoin(Artist, (a, ar) => a.artistId === ar.artistId).limit(3);

    await snap(q as AsyncSequence<[Album, Artist]>);
  });

  test("join duplicate name binding", async () => {
    const q = verse.from.artists
      .join(Album, (a, al) => a.artistId === al.artistId)
      .select((_, al) => al);

    await snap(q);
  });

  test("escape string", async () => {
    const q = verse.from.artists.where(a => a.name === "'\\");

    await snap(q);
  });

  test("duplicate projection", async () => {
    const q = verse.from.artists.select(a => [a, a]).limit(5);

    await snap(q);
  });

  test("order by lifting", async () => {
    const q = verse.from.artists
      .orderByDesc(a => a.artistId)
      .limit(100)
      .select(a => [a])
      .orderBy(a => a[0]!.name);

    await snap(q);
  });

  test("limit parameter", async () => {
    const q: ($count: number) => AsyncSequence<Album> = verse.compile((from, $count: number) =>
      from.albums.limit($count)
    );

    await snap(q(5));
  });

  test("offset parameter", async () => {
    const q = verse.compile((from, $offset: number) => from.albums.offset($offset).limit(5));

    await snap(q(3));
  });

  test("limit and offset", async () => {
    const q = verse.from.albums.limit(10).offset(5);

    await snap(q);
  });

  test("local parameter where", async () => {
    const title = "Miles Ahead";

    const q = verse.from.albums.where((a, $title: string) => a.title === $title, title);

    await snap(q);
  });

  test("local parameter where multiple", async () => {
    const title = "Miles Ahead";

    const q = verse.from.albums.where(
      (a, $title, $artistId) => a.title === $title && a.artistId === $artistId,
      title,
      68
    );

    await snap(q);
  });

  test("local parameter where null", async () => {
    const q = verse.from.tracks.where((t, $composer) => t.composer === $composer, null);

    await snap(q);
  });

  test("local parameter where undefined", async () => {
    const q = verse.from.tracks.where((t, $composer) => t.composer === $composer, undefined);

    await snap(q);
  });

  test("local parameter select", async () => {
    const title = "Miles Ahead";

    const q = verse.from.albums.select((a, $p: string) => [a, $p], title);

    await snap(q);
  });

  test("local parameter all", async () => {
    const q = verse.from.albums.all((a, $id) => a.albumId > $id, 0);

    await snap(q);
  });

  test("sub-query with limit parameter", async () => {
    const q = verse.compile((from, $limit: number) =>
      from.artists.select(_ => from.albums.limit($limit).maybeFirst())
    );

    await snap(q(1));
  });

  test("now", async () => {
    const q = verse.from.artists.select(_ => Date.now());

    await q.toArray(); // can't snap now()
  });

  test("join lifting 1", async () => {
    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select((_, ar) => ar);

    await snap(q);
  });

  test("join lifting 2", async () => {
    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select((_, ar) => [ar, ar.artistId]);

    await snap(q);
  });

  test("join lifting 3", async () => {
    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select((_, ar) => [ar, ar.artistId + 1]);

    await snap(q);
  });

  test("join lifting 4", async () => {
    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .orderBy((_, ar) => ar.artistId);

    await snap(q);
  });

  test("join lifting 5", async () => {
    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select((_, ar) => ar.name);

    await snap(q);
  });

  test("join lifting 6", async () => {
    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select((al, ar) => [ar, al.title]);

    await snap(q);
  });

  test("join lifting 7", async () => {
    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .where((_, ar) => ar.name === "Alice In Chains")
      .join(Artist, (al, _, ar) => al.artistId === ar.artistId)
      .select((_, ar) => ar.name);

    await snap(q);
  });

  test("join lifting 8", async () => {
    const q = verse.from.albums
      .select(al => ({ al }))
      .join(Artist, (o, ar) => o.al.artistId === ar.artistId)
      .where((_, ar) => ar.name === "Alice In Chains")
      .select((_, ar) => ar.name);

    await snap(q);
  });

  test("join lifting 9", async () => {
    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .select((_, ar) => [ar, ar.name]);

    await snap(q);
  });

  test("join lifting 10", async () => {
    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .orderBy((_, ar) => ar.name);

    await snap(q);
  });

  test("join min", async () => {
    const q = verse.from.albums
      .join(Artist, (al, ar) => al.artistId === ar.artistId)
      .min((_, ar) => ar.artistId);

    await snap(q);
  });
};

export const queryErrorTests = (verse: Verse<typeof queryModel>) => {
  test("closure throws", async () => {
    const local = 42;

    expect(() => {
      verse.compile(from => from.albums.where(a => a.albumId == local));
    }).toThrow(
      "Unbound identifier 'local'. Local variables are not supported. Use parameters instead."
    );
  });

  test("first no result", async () => {
    const q = verse.from.albums.where(a => a.albumId == -1).first();

    await expect(() => q).rejects.toThrow("Query produced no results (expected 1).");
  });

  test("single no result", async () => {
    const q = verse.from.albums.where(a => a.albumId == -1).single();

    await expect(() => q).rejects.toThrow("Query produced no results (expected 1).");
  });

  test("single too many", async () => {
    const q = verse.from.albums.where(a => a.albumId > 0).single();

    await expect(() => q).rejects.toThrow("Query produced more than one result (expected 1).");
  });

  test("maybeSingle too many", async () => {
    const q = verse.from.albums.where(a => a.albumId > 0).maybeSingle();

    await expect(() => q).rejects.toThrow("Query produced more than one result (expected 1).");
  });

  test("complex parameter object", async () => {
    expect(() =>
      verse.compile((from, params: { title: string; id?: number }) =>
        from.albums.where(a => a.title.like(`%${params.title}%`))
      )
    ).toThrow("Complex parameter objects are not supported: 'params.title'.");
  });

  test("aggregate not scalar", async () => {
    expect(() => verse.from.albums.avg()).toThrow(
      "Aggregate function 'avg' requires a scalar numeric input expression."
    );
  });

  test("aggregate not numeric", async () => {
    expect(() => verse.from.albums.select(a => a.title).avg()).toThrow(
      "Aggregate function 'avg' requires a scalar numeric input expression."
    );
  });
};
