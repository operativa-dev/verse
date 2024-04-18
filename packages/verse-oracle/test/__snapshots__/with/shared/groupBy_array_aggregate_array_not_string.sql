-- Executing SQL: Parameters: []
select t5.c1
from (
   select json_arrayagg(json_array(t2.ArtistId) returning varchar2(32767)) c1
   from Artist t1 
   left join Album t2 on t1.ArtistId = t2.ArtistId
   group by t1.ArtistId
) t5
where json_query(json_query(t5.c1, '$[0]'), '$[0]') > 10

