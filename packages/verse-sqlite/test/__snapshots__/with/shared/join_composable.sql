-- Executing SQL: Parameters: [$1=5]
select "t2"."ArtistId", "t3"."Name" as "c1"
from (
   select "t1"."ArtistId", "t1"."Name"
   from "Artist" as "t1"
   limit ?
) as "t2" 
inner join "Artist" as "t3" on "t2"."ArtistId" = "t3"."ArtistId"

