-- Executing SQL: Parameters: []
select t1.AlbumId, t1.Title, t1.ArtistId
from Album t1
where (
   select json_array(t2.ArtistId, t2.Name) c0
   from Artist t2
   where t1.ArtistId = t2.ArtistId
) is null

