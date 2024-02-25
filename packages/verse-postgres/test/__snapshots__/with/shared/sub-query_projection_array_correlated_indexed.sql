-- Executing SQL: Parameters: []
select (
   select json_build_array(json_agg(json_build_array("t3"."AlbumId", "t3"."Title", "t3"."ArtistId")) -> 0, json_agg(json_build_array("t3"."AlbumId", "t3"."Title", "t3"."ArtistId")) -> 1) as "c3"
   from "Album" as "t3"
   where "t1"."ArtistId" = "t3"."ArtistId"
) as "c4"
from "Artist" as "t1"

