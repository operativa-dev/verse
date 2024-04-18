-- Executing SQL: Parameters: []
select t1.Name, (
   select json_array(t3.AlbumId, t3.Title, t3.ArtistId) c0
   from Album t3
   where t1.ArtistId = t3.ArtistId
   fetch next 1 rows only
) c1
from Artist t1

