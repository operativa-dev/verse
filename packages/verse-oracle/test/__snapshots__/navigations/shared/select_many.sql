-- Executing SQL: Parameters: []
select (
   select json_arrayagg(json_array(t2.AlbumId, t2.Title, t2.ArtistId) returning varchar2(32767)) c0
   from Album t2
   where t1.ArtistId = t2.ArtistId
) c1
from Artist t1

