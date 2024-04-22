-- Executing SQL: Parameters: []
select json_arrayagg(json_array(t2.AlbumId, t2.Title, t2.ArtistId, t1.ArtistId, t1.Name) returning varchar2(32767)) c1
from Artist t1 
left join Album t2 on t1.ArtistId = t2.ArtistId
group by t1.ArtistId

