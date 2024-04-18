-- Executing SQL: Parameters: []
select t1.AlbumId, t1.Title, t1.ArtistId
from Album t1
where t1.AlbumId = -1
fetch next 2 rows only

