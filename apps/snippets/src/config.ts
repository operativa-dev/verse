// noinspection TypeScriptValidateTypes

import { verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { entity, int, string } from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

{
  /// verse-object
  const db = verse({
    // @ts-ignore
    config: {
      //...
    },
    // @ts-ignore
    model: {
      //...
    },
  });
  ///
}

{
  /// config
  const db = verse({
    config: {
      driver: sqlite(`Chinook_Sqlite.sqlite`),
      logger: new PrettyConsoleLogger(),
    },
    // @ts-ignore
    model: {
      //...
    },
  });
  ///
}

{
  /// model
  const db = verse({
    // @ts-ignore
    config: {
      //...
    },
    model: {
      entities: {
        artists: entity(
          {
            artistId: int(),
            name: string(),
          },
          builder => {
            builder.table("Artist");
          }
        ),
      },
    },
  });
  ///
}

{
  /// separate-config
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
    // @ts-ignore
    config: {
      //...
    },
    model: {
      entities: {
        artists: Artist,
      },
    },
  });
  ///
}
