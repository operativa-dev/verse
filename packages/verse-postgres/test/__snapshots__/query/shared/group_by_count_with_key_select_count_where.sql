-- Executing SQL: Parameters: []
select "t4"."c0"
from (
   select count(*) as "c0"
   from "Album" as "t1"
   group by "t1"."ArtistId"
) as "t4"
where cast("t4"."c0" as integer) > 10
order by "t4"."c0"

