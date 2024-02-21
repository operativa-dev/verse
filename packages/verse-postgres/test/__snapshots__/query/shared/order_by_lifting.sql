-- Executing SQL: Parameters: []
select "t4"."ArtistId", "t4"."Name"
from (
   select "t3"."ArtistId", "t3"."Name"
   from (
      select "t2"."ArtistId", "t2"."Name"
      from (
         select "t1"."ArtistId", "t1"."Name"
         from "Artist" as "t1"
         order by "t1"."ArtistId" desc
      ) as "t2"
      limit 100
   ) as "t3"
) as "t4"
order by "t4"."Name", "t4"."ArtistId" desc

