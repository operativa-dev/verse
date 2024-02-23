-- Executing SQL: Parameters: []
select "t1"."Name", (
   select "t5"."Title"
   from (
      select "t3"."Title"
      from "Album" as "t3"
      where "t1"."ArtistId" = "t3"."ArtistId"
   ) as "t5"
   limit 1
) as "c0"
from "Artist" as "t1"

