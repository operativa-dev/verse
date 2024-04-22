-- Executing SQL: Parameters: [$1=10, $2=5]
select t2.AlbumId, t2.Title, t2.ArtistId
from (
   select t1.AlbumId, t1.Title, t1.ArtistId
   from Album t1
   fetch next :0 rows only
) t2
offset :1 rows

