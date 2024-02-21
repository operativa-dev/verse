-- Executing SQL: Parameters: []
select "t2"."c0" -> 0 as "c1"
from (
   select json_agg(json_build_array("t1"."ArtistId", "t1"."Name")) as "c0"
   from "Artist" as "t1"
) as "t2"

