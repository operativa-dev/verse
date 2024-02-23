-- Executing SQL: Parameters: []
select (
   select json_agg(json_build_array("t3"."AlbumId", "t3"."Title", "t3"."ArtistId")) as "c0"
   from "Album" as "t3"
   where "t1"."ArtistId" = "t3"."ArtistId"
) as "c1"
from "Artist" as "t1"

