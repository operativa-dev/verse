-- Executing SQL: Parameters: []
select t2.AlbumId, t2.Title, t2.ArtistId
from (
   select t1.AlbumId, t1.Title, t1.ArtistId
   from Album t1
   order by t1.ArtistId
) t2
order by t2.Title desc, t2.ArtistId

