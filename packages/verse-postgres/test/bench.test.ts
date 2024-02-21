import { Album, Artist, queryFixture } from "@operativa/verse/test/query/query";
import { NullLogger } from "@operativa/verse/utils/logging";
import { Bench } from "tinybench";
import { test } from "vitest";
import { testDb } from "./infra.js";

test.skip("run", async () => {
  const verse = queryFixture(testDb("chinook"), NullLogger.INSTANCE);

  const q = verse.compile(from =>
    from.tracks
      .join(Album, (t, a) => t.theAlbumId === a.albumId)
      .join(Artist, ([_, a], ar) => a.artistId === ar.artistId)
      .where(([[_, a], __]) => a.title == "Miles Ahead")
      .select(([[t, a], ar]) => ({ album: a.title, artist: ar.name, track: t.name }))
      .limit(1)
  );

  const bench = new Bench({ time: 1500 });

  bench
    .add("non-compiled", async () => {
      await verse.from.tracks
        .join(Album, (t, a) => t.theAlbumId === a.albumId)
        .join(Artist, ([_, a], ar) => a.artistId === ar.artistId)
        .where(([[_, a], __]) => a.title == "Miles Ahead")
        .select(([[t, a], ar]) => ({ album: a.title, artist: ar.name, track: t.name }))
        .limit(1)
        .toArray();
    })
    .add("compiled", async () => {
      await q().toArray();
    });

  await bench.run();

  console.table(bench.table());
}, 10000);
