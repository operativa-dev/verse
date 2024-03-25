import { verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { entity, int, string } from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

const Album = entity(
  {
    albumId: int(),
    title: string(),
    artistId: int(),
  },
  builder => {
    builder.table("Album");
  }
);

const Artist = entity(
  {
    artistId: int(),
    name: string(),
  },
  builder => {
    builder.table("Artist");
  }
);

const db = verse({
  config: {
    driver: sqlite("Chinook_Sqlite.sqlite"),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      albums: Album,
      artists: Artist,
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
