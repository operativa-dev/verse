-- Executing SQL: Parameters: []
select json_query('[' + (string_agg(trim('[]' from json_modify('[]', 'append $', "t2"."Name")), ',') + ']'), '$[0]') as "c1"
from "Artist" as "t2"

