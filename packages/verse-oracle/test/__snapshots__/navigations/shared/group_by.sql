-- Executing SQL: Parameters: []
select json_arrayagg((
   select json_array(t2.AlbumId, t2.Title, t2.ArtistId) c0
   from Album t2
   where t1.AlbumId = t2.AlbumId
) returning varchar2(32767)) c1
from Track t1
group by t1.AlbumId

