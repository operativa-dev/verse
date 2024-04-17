-- Executing SQL: Parameters: [$1=1]
select json_agg(json_build_array("t2"."ArtistId", "t2"."Name")) -> 0 as "c1"
from (
   select "t1"."ArtistId", "t1"."Name"
   from "Artist" as "t1"
   limit $1
) as "t2"

