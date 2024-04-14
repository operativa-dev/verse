-- Executing SQL: Parameters: [$1=5]
select t2.ArtistId, t3.Name c1
from (
   select t1.ArtistId, t1.Name
   from Artist t1
   fetch next :0 rows only
) t2 
left join Artist t3 on t2.ArtistId = t3.ArtistId

