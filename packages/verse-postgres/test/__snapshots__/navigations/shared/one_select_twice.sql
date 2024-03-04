-- Executing SQL: Parameters: []
select (
   select json_build_array("t2"."ArtistId", "t2"."Name") as "c0"
   from "Artist" as "t2"
   where "t1"."ArtistId" = "t2"."ArtistId"
) as "c2", (
   select json_build_array("t4"."ArtistId", "t4"."Name") as "c1"
   from "Artist" as "t4"
   where "t1"."ArtistId" = "t4"."ArtistId"
) as "c3"
from "Album" as "t1"

