-- Executing SQL: Parameters: []
select t1.ArtistId, json_arrayagg(json_array(t1.AlbumId, t1.Title, t1.ArtistId) returning varchar2(32767)) c0
from Album t1
group by t1.ArtistId

