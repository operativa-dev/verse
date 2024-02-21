-- Executing SQL: Parameters: []
select "t1"."Name", (
   select json_array("t5"."AlbumId", "t5"."Title", "t5"."ArtistId") as "c0"
   from (
      select "t4"."AlbumId", "t4"."Title", "t4"."ArtistId"
      from (
         select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
         from "Album" as "t3"
         where "t1"."ArtistId" = "t3"."ArtistId"
      ) as "t4"
      limit 1
   ) as "t5"
) as "c1"
from "Artist" as "t1"

