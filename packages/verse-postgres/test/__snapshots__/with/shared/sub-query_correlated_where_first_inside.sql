-- Executing SQL: Parameters: []
select "t1"."ArtistId", "t1"."Name"
from "Artist" as "t1"
where "t1"."ArtistId" = (
   select "t5"."ArtistId"
   from (
      select "t3"."ArtistId"
      from "Album" as "t3"
      where "t1"."ArtistId" = "t3"."ArtistId"
   ) as "t5"
   limit 1
)

