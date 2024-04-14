-- Executing SQL: Parameters: []
select (
   select json_arrayagg(json_array(t3.AlbumId, t3.Title, t3.ArtistId) returning varchar2(32767)) c0
   from Album t3
   where t1.ArtistId = t3.ArtistId
) c1
from Artist t1

