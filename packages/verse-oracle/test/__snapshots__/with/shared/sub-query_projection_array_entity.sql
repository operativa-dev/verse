-- Executing SQL: Parameters: [$1=5]
select t1.ArtistId, t1.Name, (
   select json_arrayagg(json_array(t4.AlbumId, t4.Title, t4.ArtistId) returning varchar2(32767)) c0
   from Album t4
   where t1.ArtistId = t4.ArtistId
) c1
from Artist t1
fetch next :0 rows only

