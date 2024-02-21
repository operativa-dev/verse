-- Executing SQL: Parameters: []
select "t3"."c0"
from (
   select '[' + (string_agg(trim('[]' from json_modify('[]', 'append $', "t2"."Name")), ',') + ']') as "c0"
   from "Artist" as "t2"
) as "t3"

