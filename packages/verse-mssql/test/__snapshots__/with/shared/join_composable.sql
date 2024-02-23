-- Executing SQL: Parameters: []
select "t2"."ArtistId", "t3"."Name" as "c1"
from (
   select "t1"."ArtistId", "t1"."Name"
   from "Artist" as "t1"
   order by 1 offset 0 rows fetch next 5 rows only
) as "t2" 
inner join "Artist" as "t3" on "t2"."ArtistId" = "t3"."ArtistId"

