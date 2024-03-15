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

const artists = await db.from.artists
  .where(a => a.name.like("A%"))
  .select(a => a.name)
  .toArray();

const query = db.from.artists
  .where(a => a.name.like("A%"))
  .select(a => a.name);

for await (const name of query) {
  console.log(name);
}

const acdc = await db.from.artists
  .where(a => a.name === "AC/DC")
  .first();

const alanis = await db.from.artists
  .where(a => a.name === "Alanis Morissette")
  .single();
