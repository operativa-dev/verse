-- Executing SQL: Parameters: []
select (
   select json_array(t2.ArtistId, t2.Name) c0
   from Artist t2
   where t1.ArtistId = t2.ArtistId
) c2, (
   select json_array(t4.ArtistId, t4.Name) c1
   from Artist t4
   where t1.ArtistId = t4.ArtistId
) c3
from Album t1

