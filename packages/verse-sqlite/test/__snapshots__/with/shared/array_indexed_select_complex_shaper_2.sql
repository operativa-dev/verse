-- Executing SQL: Parameters: []
select "t3"."c1", "t3"."c1" ->> 1 as "c2", "t3"."c1" as "c4", "t3"."c1" ->> 0 as "c3"
from (
   select "t2"."c0" -> 0 as "c1"
   from (
      select json_group_array(json_array("t1"."ArtistId", "t1"."Name")) as "c0"
      from "Artist" as "t1"
   ) as "t2"
) as "t3"

