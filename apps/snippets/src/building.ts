import { EntityType } from "@operativa/verse";
import { entity, int, string } from "@operativa/verse/model/builder";

class Artist {
  constructor(
    readonly id: number,
    public name: string
  ) {}
}

class Album {
  constructor(
    readonly id: number,
    public name: string,
    public artistId: number
  ) {}
}

const classModel = {
  albums: entity(
    Album,
    {
      id: int(),
      name: string({ maxLength: 100 }),
      artistId: int({ nullable: false, column: "ArtistId" }),
    },
    builder => {
      builder.table("Albums");
      builder.key("id");
      builder.references(Artist, "artistId");
    }
  ),
};

const objectModel = {
  albums: entity(
    {
      id: int(),
      name: string({ maxLength: 100 }),
      artistId: int({ nullable: false, column: "ArtistId" }),
    },
    builder => {
      builder.table("Albums");
      builder.key("id");
      builder.references(Artist, "artistId");
    }
  ),
};

type AlbumType = EntityType<typeof objectModel.albums>;
