-- Executing SQL: Parameters: []
select (
   select json_array(t3.AlbumId, t3.Title, t3.ArtistId) c0
   from Album t3
   fetch next 1 rows only
) c1
from Artist t1

