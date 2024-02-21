-- Executing SQL: Parameters: []
select "t2"."ArtistId", "t2"."c0"
from (
   select "t1"."ArtistId", count(*) as "c0"
   from "Album" as "t1"
   group by "t1"."ArtistId"
) as "t2"

