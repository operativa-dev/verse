-- Executing SQL: Parameters: []
select (
   select "t3"."Title"
   from "Album" as "t3"
   where "t3"."Title" like 'T%'
   order by 1 offset 0 rows fetch next 1 rows only
) as "c0"
from "Artist" as "t1"

