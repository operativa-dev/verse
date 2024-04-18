-- Executing SQL: Parameters: []
select t1.ArtistId, json_arrayagg(json_array(t1.ArtistId, t1.Name, t2.AlbumId, t2.Title, t2.ArtistId, 42, t2.Title) returning varchar2(32767)) c1
from Artist t1 
left join Album t2 on t1.ArtistId = t2.ArtistId
group by t1.ArtistId

