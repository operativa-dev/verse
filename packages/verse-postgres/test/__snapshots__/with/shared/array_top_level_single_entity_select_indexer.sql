-- Executing SQL: Parameters: []
select json_agg(json_build_array("t2"."ArtistId", "t2"."Name")) -> 0 as "c1"
from "Artist" as "t2"

