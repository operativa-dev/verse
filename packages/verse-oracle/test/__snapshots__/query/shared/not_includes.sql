-- Executing SQL: Parameters: []
select t1.AlbumId, t1.Title, t1.ArtistId
from Album t1
where not (t1.ArtistId in (1, 2))

