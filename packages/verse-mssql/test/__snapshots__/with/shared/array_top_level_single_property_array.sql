-- Executing SQL: Parameters: []
select '[' + (string_agg(json_array("t2"."Name"), ',') + ']') as "c0"
from "Artist" as "t2"

