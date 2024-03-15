-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
where (
   select json_build_array("t2"."ArtistId", "t2"."Name") as "c0"
   from "Artist" as "t2"
   where "t1"."ArtistId" = "t2"."ArtistId"
) is null

