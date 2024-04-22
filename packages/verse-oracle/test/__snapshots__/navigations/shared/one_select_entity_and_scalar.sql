-- Executing SQL: Parameters: []
select (
   select json_array(t2.ArtistId, t2.Name) c0
   from Artist t2
   where t1.ArtistId = t2.ArtistId
) c1, t4.Name c2
from Album t1 
inner join Artist t4 on t1.ArtistId = t4.ArtistId

