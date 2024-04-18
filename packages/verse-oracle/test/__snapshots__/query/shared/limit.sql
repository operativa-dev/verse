-- Executing SQL: Parameters: [$1=5]
select t1.AlbumId, t1.Title, t1.ArtistId
from Album t1
fetch next :0 rows only

