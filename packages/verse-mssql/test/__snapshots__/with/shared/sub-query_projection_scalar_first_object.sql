-- Executing SQL: Parameters: []
select (
   select "t4"."Title"
   from "Album" as "t4"
   order by 1 offset 0 rows fetch next 1 rows only
) as "c0", "t1"."Name"
from "Artist" as "t1"

