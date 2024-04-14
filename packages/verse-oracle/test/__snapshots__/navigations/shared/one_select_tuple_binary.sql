-- Executing SQL: Parameters: []
select t1.AlbumId, t1.Title, t1.ArtistId, (
   select json_array(t2.ArtistId, t2.Name) c0
   from Artist t2
   where t1.ArtistId = t2.ArtistId
) c1, t1.ArtistId + 1 c2
from Album t1

