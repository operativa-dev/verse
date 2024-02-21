-- Executing SQL: Parameters: []
select "t3"."c0"
from (
   select json_agg("t2"."Name") as "c0"
   from "Artist" as "t2"
) as "t3"

