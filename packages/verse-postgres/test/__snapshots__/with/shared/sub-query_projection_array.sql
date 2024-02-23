-- Executing SQL: Parameters: []
select (
   select json_agg("t5"."Title") as "c0"
   from (
      select "t3"."Title"
      from "Album" as "t3"
      where "t3"."Title" like 'T%'
   ) as "t5"
) as "c1"
from "Artist" as "t1"

