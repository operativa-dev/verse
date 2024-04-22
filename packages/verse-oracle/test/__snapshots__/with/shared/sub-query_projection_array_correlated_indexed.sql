-- Executing SQL: Parameters: []
select (
   select json_array(json_query(json_arrayagg(json_array(t3.AlbumId, t3.Title, t3.ArtistId) returning varchar2(32767)), '$[0]'), json_query(json_arrayagg(json_array(t3.AlbumId, t3.Title, t3.ArtistId) returning varchar2(32767)), '$[1]')) c3
   from Album t3
   where t1.ArtistId = t3.ArtistId
) c4
from Artist t1

