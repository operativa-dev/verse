-- Executing SQL: Parameters: [$1='Miles Ahead']
select t3.c0, t3.c1
from (
   select ('Hi ' || t1.Title) || '!' c0, t1.ArtistId * 2 c1
   from Album t1
   where t1.Title = :0
) t3
where t3.c1 > 12

