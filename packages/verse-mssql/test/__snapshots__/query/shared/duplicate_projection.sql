-- Executing SQL: Parameters: []
select "t2"."ArtistId", "t2"."Name", "t2"."c0", "t2"."c1"
from (
   select "t1"."ArtistId", "t1"."Name", "t1"."ArtistId" as "c0", "t1"."Name" as "c1"
   from "Artist" as "t1"
) as "t2"
order by 1 offset 0 rows fetch next 5 rows only

