-- Executing SQL: Parameters: [$1=1]
select (
   select json_build_array("t5"."AlbumId", "t5"."Title", "t5"."ArtistId") as "c0"
   from (
      select "t4"."AlbumId", "t4"."Title", "t4"."ArtistId"
      from (
         select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
         from "Album" as "t3"
         limit $1
      ) as "t4"
      limit 1
   ) as "t5"
) as "c1"
from "Artist" as "t1"

