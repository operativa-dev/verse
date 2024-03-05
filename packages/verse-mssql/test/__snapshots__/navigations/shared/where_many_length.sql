-- Executing SQL: Parameters: []
select "t1"."ArtistId", "t1"."Name"
from "Artist" as "t1"
where (
   select count(*)
   from "Album" as "t2"
   where "t1"."ArtistId" = "t2"."ArtistId"
) > 1

