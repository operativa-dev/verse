-- Executing SQL: Parameters: []
select "t6"."ArtistId", "t6"."c1"
from (
   select "t2"."ArtistId", "t2"."Name", "t3"."ArtistId" as "c0", "t3"."Name" as "c1"
   from (
      select "t1"."ArtistId", "t1"."Name"
      from "Artist" as "t1"
      order by 1 offset 0 rows fetch next 5 rows only
   ) as "t2" 
   inner join "Artist" as "t3" on "t2"."ArtistId" = "t3"."ArtistId"
) as "t6"

