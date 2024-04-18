-- Executing SQL: Parameters: []
select t7.c3
from (
   select json_query(json_query(json_arrayagg(json_array(t2.AlbumId, t2.Title, t2.ArtistId) returning varchar2(32767)), '$[0]'), '$[1]') c3
   from Artist t1 
   left join Album t2 on t1.ArtistId = t2.ArtistId
   group by t1.ArtistId
) t7
where t7.c3 like 'T%'

