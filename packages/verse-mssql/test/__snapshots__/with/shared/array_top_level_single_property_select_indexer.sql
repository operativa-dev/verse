-- Executing SQL: Parameters: []
select json_query("t3"."c0", '$[0]') as "c1"
from (
   select '[' + (string_agg(trim('[]' from json_modify('[]', 'append $', "t2"."Name")), ',') + ']') as "c0"
   from "Artist" as "t2"
) as "t3"

