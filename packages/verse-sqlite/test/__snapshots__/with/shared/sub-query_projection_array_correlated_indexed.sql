-- Executing SQL: Parameters: []
select (
   select json_array("t5"."c0" -> 0, "t5"."c0" -> 1) as "c3"
   from (
      select json_group_array(json_array("t3"."AlbumId", "t3"."Title", "t3"."ArtistId")) as "c0"
      from "Album" as "t3"
      where "t1"."ArtistId" = "t3"."ArtistId"
   ) as "t5"
) as "c4"
from "Artist" as "t1"

