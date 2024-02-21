-- Executing SQL: Parameters: []
select ("t2"."c0" -> 0) ->> 1 as "c1", "t2"."c0" -> 1 as "c2", "t2"."c0" -> 2 as "c3"
from (
   select json_group_array(json_array("t1"."ArtistId", "t1"."Name")) as "c0"
   from "Artist" as "t1"
) as "t2"

