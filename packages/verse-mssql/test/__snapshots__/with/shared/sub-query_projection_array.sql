-- Executing SQL: Parameters: []
select (
   select '[' + (string_agg(trim('[]' from json_modify('[]', 'append $', "t3"."Title")), ',') + ']') as "c0"
   from "Album" as "t3"
   where "t3"."Title" like 'T%'
) as "c1"
from "Artist" as "t1"

