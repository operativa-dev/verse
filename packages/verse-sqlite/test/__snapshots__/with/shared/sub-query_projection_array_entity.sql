-- Executing SQL: Parameters: []
select "t1"."ArtistId", "t1"."Name", (
   select json_group_array(json_array("t4"."AlbumId", "t4"."Title", "t4"."ArtistId")) as "c0"
   from "Album" as "t4"
   where "t1"."ArtistId" = "t4"."ArtistId"
) as "c1"
from "Artist" as "t1"
limit 5

