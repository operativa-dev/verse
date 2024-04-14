-- Executing SQL: Parameters: [$1=5]
select t2.ArtistId, t2.Name, t3.ArtistId c0, t3.Name c1
from (
   select t1.ArtistId, t1.Name
   from Artist t1
   fetch next :0 rows only
) t2 
left join (
   select t5.ArtistId, t5.Name
   from Artist t5
   order by t5.ArtistId
) t3 on t2.ArtistId = t3.ArtistId

