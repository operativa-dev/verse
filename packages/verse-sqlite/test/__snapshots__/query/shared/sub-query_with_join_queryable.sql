-- Executing SQL: Parameters: []
select (
   select json_array("t3"."AlbumId", "t3"."Title", "t3"."ArtistId", "t4"."ArtistId", "t4"."Name") as "c1"
   from "Album" as "t3" 
   inner join "Artist" as "t4" on "t3"."ArtistId" = "t4"."ArtistId"
   limit 1
) as "c2"
from "Artist" as "t1"

