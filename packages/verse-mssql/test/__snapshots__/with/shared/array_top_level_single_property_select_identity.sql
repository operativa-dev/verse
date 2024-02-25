-- Executing SQL: Parameters: []
select '[' + (string_agg(trim('[]' from json_modify('[]', 'append $', "t2"."Name")), ',') + ']') as "c0"
from "Artist" as "t2"

