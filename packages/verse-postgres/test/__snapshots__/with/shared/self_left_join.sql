-- Executing SQL: Parameters: []
select "t5"."ArtistId", "t5"."c1"
from (
   select "t2"."ArtistId", "t2"."Name", "t3"."ArtistId" as "c0", "t3"."Name" as "c1"
   from (
      select "t1"."ArtistId", "t1"."Name"
      from "Artist" as "t1"
      limit 5
   ) as "t2" 
   left join "Artist" as "t3" on "t2"."ArtistId" = "t3"."ArtistId"
) as "t5"

