-- Executing SQL: Parameters: [$1=5]
select "t2"."ArtistId", "t2"."Name", "t3"."ArtistId" as "c0", "t3"."Name" as "c1"
from (
   select "t1"."ArtistId", "t1"."Name"
   from "Artist" as "t1"
   order by 1 offset 0 rows fetch next @p0 rows only
) as "t2" 
left join (
   select "t5"."ArtistId", "t5"."Name"
   from "Artist" as "t5"
   order by "t5"."ArtistId" offset 0 rows
) as "t3" on "t2"."ArtistId" = "t3"."ArtistId"

