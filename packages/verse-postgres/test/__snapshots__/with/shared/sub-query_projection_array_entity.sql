-- Executing SQL: Parameters: []
select "t2"."ArtistId", "t2"."Name", (
   select json_agg(json_build_array("t5"."AlbumId", "t5"."Title", "t5"."ArtistId")) as "c0"
   from (
      select "t4"."AlbumId", "t4"."Title", "t4"."ArtistId"
      from "Album" as "t4"
      where "t2"."ArtistId" = "t4"."ArtistId"
   ) as "t5"
) as "c1"
from (
   select "t1"."ArtistId", "t1"."Name"
   from "Artist" as "t1"
   limit 5
) as "t2"

