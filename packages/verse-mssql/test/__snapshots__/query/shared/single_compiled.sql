-- Executing SQL: Parameters: []
select "t3"."c0"
from (
   select ('Title: ' + "t1"."Title") + '!' as "c0"
   from "Album" as "t1"
   where "t1"."Title" = 'Miles Ahead'
) as "t3"
order by 1 offset 0 rows fetch next 2 rows only

