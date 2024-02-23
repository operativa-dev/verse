-- Executing SQL: Parameters: []
select "t4"."ArtistId", "t4"."Name"
from (
   select "t2"."ArtistId", "t2"."Name"
   from (
      select "t1"."ArtistId", "t1"."Name"
      from "Artist" as "t1"
      order by "t1"."ArtistId" desc offset 0 rows
   ) as "t2"
   order by 1 offset 0 rows fetch next 100 rows only
) as "t4"
order by "t4"."Name", "t4"."ArtistId" desc

