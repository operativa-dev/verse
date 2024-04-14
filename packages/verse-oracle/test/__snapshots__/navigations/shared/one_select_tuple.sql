-- Executing SQL: Parameters: []
select (
   select json_array(t2.ArtistId, t2.Name) c0
   from Artist t2
   where t1.ArtistId = t2.ArtistId
) c1, t1.ArtistId
from Album t1

