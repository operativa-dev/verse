-- Executing SQL: Parameters: []
select t4.c0
from (
   select count(*) c0
   from Album t1
   group by t1.ArtistId
) t4
where t4.c0 > 10
order by t4.c0

