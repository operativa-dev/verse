-- Executing SQL: Parameters: []
select ('Title: ' + "t1"."Title") + '!' as "c0"
from "Album" as "t1"
where "t1"."Title" = 'Miles Ahead'
order by 1 offset 0 rows fetch next 2 rows only

