-- Executing SQL: Parameters: []
select "t9"."c2"
from (
   select "t2"."Name" as "c2"
   from "Album" as "t1" 
   inner join "Artist" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
   where "t2"."Name" = 'Alice In Chains'
) as "t9"
where "t9"."c2" = 'Alice In Chains'

