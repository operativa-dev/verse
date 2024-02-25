-- Executing SQL: Parameters: []
select json_agg("t2"."Name") ->> 0 as "c1"
from "Artist" as "t2"

