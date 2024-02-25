-- Executing SQL: Parameters: []
select json_agg(json_build_array("t1"."ArtistId", "t1"."Name")) -> 0 as "c1"
from "Artist" as "t1"

