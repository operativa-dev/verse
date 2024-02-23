-- Executing SQL: Parameters: []
select "t5"."Composer"
from (
   select "t1"."Composer"
   from "Track" as "t1" 
   inner join "Album" as "t2" on "t1"."AlbumId" = "t2"."AlbumId"
) as "t5"
order by "t5"."Composer"

