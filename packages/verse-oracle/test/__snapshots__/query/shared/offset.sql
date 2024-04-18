-- Executing SQL: Parameters: [$1=3, $2=5]
select t2.AlbumId, t2.Title, t2.ArtistId
from (
   select t1.AlbumId, t1.Title, t1.ArtistId
   from Album t1
   offset :0 rows
) t2
fetch next :1 rows only

