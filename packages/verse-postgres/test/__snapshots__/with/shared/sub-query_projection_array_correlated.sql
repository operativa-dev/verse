-- Executing SQL: Parameters: []
select (
   select json_agg(json_build_array("t4"."AlbumId", "t4"."Title", "t4"."ArtistId")) as "c0"
   from (
      select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
      from "Album" as "t3"
      where "t1"."ArtistId" = "t3"."ArtistId"
   ) as "t4"
) as "c1"
from "Artist" as "t1"

