// noinspection JSUnusedLocalSymbols,JSUnusedAssignment

import { EntityType, verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { entity, int, many, one, string } from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

const Track = entity({
  trackId: int(),
  name: string(),
  albumId: int(),
  genreId: int(),
  composer: string({ nullable: true }),
  album: one<AlbumType>("Album"),
});

type TrackType = EntityType<typeof Track>;

type AlbumType = {
  albumId: number;
  title: string;
  artistId: number;
  artist: ArtistType;
  tracks: TrackType[];
};

const Artist = entity(
  {
    artistId: int(),
    name: string(),
    albums: many<AlbumType>("Album"),
  },
  builder => {
    builder.table("Artist");
  }
);

type ArtistType = EntityType<typeof Artist>;

const Album = entity(
  {
    albumId: int(),
    title: string(),
    artistId: int(),
    tracks: many(Track),
    artist: one(Artist),
  },
  builder => {
    builder.table("Album");
  }
);

const db = verse({
  config: {
    driver: sqlite(`${__dirname}/Chinook_Sqlite.sqlite`),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      albums: Album,
      artists: Artist,
      tracks: Track,
    },
  },
});

/// basic-query
const artists = await db.from.artists
  .where(a => a.name.like("A%"))
  .select(a => a.name)
  .toArray();
///

/// for-await
const query = db.from.artists.where(a => a.name.like("A%")).select(a => a.name);

for await (const name of query) {
  console.log(name);
}
///

/// first-or-single
const acdc = await db.from.artists.where(a => a.name === "AC/DC").first();

const alanis = await db.from.artists
  .where(a => a.name === "Alanis Morissette")
  .single();
///

/// parameterized
const artist = "Audioslave"; // usually from user input

const parameterized = await db.from.artists
  .where((a, $artist) => a.name === $artist, artist)
  .single();
///

/// all
const all = await db.from.artists.all(a => a.name !== "AC/DC"); // false
///

/// any
let any = await db.from.artists.where(a => a.name === "AC/DC").any(); // true
///

/// any-pred
any = await db.from.artists.any(a => a.name === "AC/DC"); // true
///

/// array
const array = await db.from.artists.array().first(); // true
///

/// avg
let avg = await db.from.artists.select(a => a.artistId).avg();
///

/// avg-short
avg = await db.from.artists.avg(a => a.artistId);
///

/// count
const count = await db.from.artists.count();
///

/// distinct
const distinct = await db.from.artists
  .select(a => a.name)
  .distinct()
  .toArray();
///

/// first
let first = await db.from.artists.where(a => a.name === "AC/DC").first();
///

/// first-pred
first = await db.from.artists.first(a => a.name === "AC/DC");
///

/// group-by
const groupBy = await db.from.albums.groupBy(a => a.artistId).toArray();
///

/// group-by-agg
const albumCounts = await db.from.albums
  .groupBy(
    a => a.artistId,
    g => ({
      artist: g.key,
      count: g.count(),
    })
  )
  .toArray();
///

/// join
const joined = await db.from.artists
  .join(db.from.albums, (ar, al) => ar.artistId === al.artistId)
  .select((ar, al) => ({
    artist: ar.name,
    album: al.title,
  }))
  .toArray();
///

/// left-join
const leftJoined = await db.from.artists
  .leftJoin(db.from.albums, (ar, al) => ar.artistId === al.artistId)
  .toArray();
///

/// limit
const limit = await db.from.artists.limit(5).toArray();
///

/// max
let max = await db.from.artists.select(a => a.artistId).max();
///

/// max-short
avg = await db.from.artists.max(a => a.artistId);
///

/// maybe-first
let maybeFirst = await db.from.artists
  .where(a => a.name === "Allan Holdsworth")
  .maybeFirst();
///

/// maybe-first-pred
maybeFirst = await db.from.artists.maybeFirst(
  a => a.name === "Allan Holdsworth"
);
///

/// maybe-single
let maybeSingle = await db.from.artists
  .where(a => a.name === "Allan Holdsworth")
  .maybeSingle();
///

/// maybe-single-pred
maybeSingle = await db.from.artists.maybeSingle(
  a => a.name === "Allan Holdsworth"
);
///

/// min
let min = await db.from.artists.select(a => a.artistId).min();
///

/// min-short
avg = await db.from.artists.min(a => a.artistId);
///

/// offset
const offset = await db.from.artists.offset(5).toArray();
///

/// order-by
const ordered = await db.from.artists.orderBy(a => a.name).toArray();
///

/// order-by-desc
const orderedDesc = await db.from.artists.orderByDesc(a => a.name).toArray();
///

/// select
const select = await db.from.artists.select(a => a.name).toArray();
///

/// select-complex
const selectComplex = await db.from.albums
  .select(a => ({
    id: a.albumId,
    desc: `Title: ${a.title}`,
    props: [a.artistId],
  }))
  .toArray();
///

/// single
let single = await db.from.artists.where(a => a.name === "AC/DC").single();
///

/// single-pred
single = await db.from.artists.single(a => a.name === "AC/DC");
///

/// sum
let sum = await db.from.artists.select(a => a.artistId).sum();
///

/// sum-short
sum = await db.from.artists.sum(a => a.artistId);
///

/// to-array
const toArray = await db.from.artists.toArray();
///

/// where
const where = await db.from.artists.where(a => a.name === "AC/DC").toArray();
///

/// from-parameter
const amount = 3; // usually from user input

const albums = await db.from.artists
  .where(
    (ar, $count, from) =>
      from.albums.where(al => ar.artistId === al.artistId).count() > $count,
    amount
  )
  .toArray();
///

/// compiled
const artistsQuery = db.compile((from, $count: number) =>
  from.artists.where(
    ar => from.albums.where(al => ar.artistId === al.artistId).count() > $count
  )
);

const result1 = await artistsQuery(3).toArray();
const result2 = await artistsQuery(5).toArray();
///

/// with
let eager = db.from.artists.limit(1).with(a => a.albums);

for await (const artist of eager) {
  console.log(artist);
}
///

/// sql
const name = "AC/DC"; // usually from user input, parameterized

const sql = await db.from.artists
  .sql`select * from Artist where Name = ${name}`.toArray();
///

/// with-multiple-1
const artistAlbumsTracks = db.from.artists
  .limit(1)
  .with(ar => ar.albums.with(al => al.tracks))
  .toArray();
///

/// with-multiple-2
const trackAlbumArtist = db.from.tracks
  .limit(1)
  .with(t => t.album.artist)
  .toArray();
///
