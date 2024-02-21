-- Executing SQL: Parameters: []
select json_agg(json_build_array("t2"."Name")) as "c0"
from "Artist" as "t2"

