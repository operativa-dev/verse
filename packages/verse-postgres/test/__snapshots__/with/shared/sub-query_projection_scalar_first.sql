-- Executing SQL: Parameters: []
select (
   select "t5"."Title"
   from (
      select "t3"."Title"
      from "Album" as "t3"
      where "t3"."Title" like 'T%'
   ) as "t5"
   limit 1
) as "c0"
from "Artist" as "t1"

