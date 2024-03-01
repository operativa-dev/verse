import { expect, test } from "vitest";

import { Driver } from "../../src/db/driver.js";
import { entity, int, many, one, string } from "../../src/model/builder.js";
import { EntityType, Verse } from "../../src/verse.js";
import { dbTest, fixture, snap } from "../infra.js";

type AlbumType = {
  albumId: number;
  title: string;
  artistId?: number;
  artist?: ArtistType;
};

const Artist = entity(
  {
    id: int(),
    name: string(),
    albums: many<AlbumType>("Album"),
  },
  a => {
    a.data({ id: 1, name: "Allan Holdsworth", albums: [] });
  }
);

type ArtistType = EntityType<typeof Artist>;

const Album = entity(
  {
    albumId: int(),
    title: string(),
    artistId: int({ nullable: true }),
    artist: one(Artist, { nullable: true }),
  },
  a => {
    a.data(
      {
        albumId: 10,
        artistId: 1,
        title: "The Sixteen Men of Tain",
      },
      {
        albumId: 11,
        artistId: 1,
        title: "Atavachron",
      },
      {
        albumId: 12,
        artistId: 1,
        title: "Metal Fatigue",
      }
    );
  }
);

const objectsModel = {
  entities: {
    albums: Album,
    artists: Artist,
  },
};

export const objectsFixture = (driver: Driver) => {
  return fixture(driver, objectsModel);
};

export const objectsTests = (verse: Verse<typeof objectsModel.entities>) => {
  dbTest(verse);

  test("identity", async ctx => {
    const q = verse.from.albums;

    await snap(ctx, await q.toArray());
  });

  test("select scalar identity", async ctx => {
    const q = verse.from.albums.select(a => a.title).select(t => t);

    await snap(ctx, await q.toArray());
  });

  test("join", async ctx => {
    const q = verse.from.albums.join(verse.from.artists, (a, ar) => a.artistId === ar.id);

    await snap(ctx, await q.toArray());
  });

  test("eager", async ctx => {
    const q = verse.from.albums.with(a => a.artist?.albums.with(a => a.artist));

    await snap(ctx, await q.toArray());
  });

  test("uow", async () => {
    let uow = verse.uow();

    const album: AlbumType = { albumId: -1, title: "Eidolon", artistId: 1 };

    await uow.albums.add(album);

    await uow.commit();

    uow = verse.uow();

    let eidolon = await uow.albums.where(a => a.title == "Eidolon").single();

    eidolon.title = "Sand";

    await uow.commit();

    uow = verse.uow();

    eidolon = await uow.albums.where(a => a.title == "Sand").single();

    uow.remove(eidolon);

    await uow.commit();
  });

  test("uow add no label throws", async () => {
    const uow = verse.uow();

    const album: AlbumType = { albumId: 1, title: "a" };

    await expect(async () => uow.add(album)).rejects.toThrow(
      'Unable to determine an entity type for object: \'{"albumId":1,"title":"a"}\'.'
    );
  });
};
