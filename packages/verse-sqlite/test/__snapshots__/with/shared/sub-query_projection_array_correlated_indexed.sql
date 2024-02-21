-- Executing SQL: Parameters: []
select (
   select json_array("t6"."c1", "t6"."c2") as "c3"
   from (
      select "t5"."c0" -> 0 as "c1", "t5"."c0" -> 1 as "c2"
      from (
         select json_group_array(json_array("t4"."AlbumId", "t4"."Title", "t4"."ArtistId")) as "c0"
         from (
            select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
            from "Album" as "t3"
            where "t1"."ArtistId" = "t3"."ArtistId"
         ) as "t4"
      ) as "t5"
   ) as "t6"
) as "c4"
from "Artist" as "t1"

