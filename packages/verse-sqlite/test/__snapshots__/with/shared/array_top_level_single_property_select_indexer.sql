-- Executing SQL: Parameters: []
select "t3"."c0" ->> 0 as "c1"
from (
   select json_group_array("t2"."Name") as "c0"
   from "Artist" as "t2"
) as "t3"

