-- Executing SQL: Parameters: [$1=1]
select (
   select json_array(t5.AlbumId, t5.Title, t5.ArtistId) c0
   from (
      select t4.AlbumId, t4.Title, t4.ArtistId
      from Album t4
      fetch next :0 rows only
   ) t5
   where t5.ArtistId = t2.ArtistId
) c1
from Artist t2

