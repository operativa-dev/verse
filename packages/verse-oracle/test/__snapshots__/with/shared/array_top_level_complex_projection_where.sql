-- Executing SQL: Parameters: []
select t4.c1
from (
   select json_query(json_query(json_arrayagg(json_array(t2.ArtistId, t2.Name) returning varchar2(32767)), '$[0]'), '$[1]') c1
   from Artist t2
) t4
where t4.c1 = 'AC/DC'

