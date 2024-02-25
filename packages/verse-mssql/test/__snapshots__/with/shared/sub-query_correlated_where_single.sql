-- Executing SQL: Parameters: []
select "t1"."ArtistId", "t1"."Name"
from "Artist" as "t1"
where "t1"."ArtistId" = (
   select "t3"."ArtistId"
   from "Album" as "t3"
   where ("t1"."ArtistId" = "t3"."ArtistId") and ("t1"."Name" = 'Buddy Guy')
   order by 1 offset 0 rows fetch next 2 rows only
)

