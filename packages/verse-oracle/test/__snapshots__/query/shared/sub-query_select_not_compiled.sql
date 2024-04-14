-- Executing SQL: Parameters: [$1=1]
select (
   select json_array(t4.AlbumId, t4.Title, t4.ArtistId) c0
   from (
      select t3.AlbumId, t3.Title, t3.ArtistId
      from Album t3
      fetch next :0 rows only
   ) t4
   fetch next 1 rows only
) c1
from Artist t1

