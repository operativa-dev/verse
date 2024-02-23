-- Executing SQL: Parameters: []
select "t5"."ArtistId", "t5"."Name", "t5"."c1"
from (
   select "t1"."ArtistId", "t1"."Name", (
      select json_agg(json_build_array("t3"."AlbumId", "t3"."Title", "t3"."ArtistId")) as "c0"
      from "Album" as "t3"
      where "t1"."ArtistId" = "t3"."ArtistId"
   ) as "c1"
   from "Artist" as "t1"
) as "t5"
limit 5

