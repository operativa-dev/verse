-- Executing SQL: Parameters: []
select json_query(json_query(json_arrayagg(json_array(t1.ArtistId, t1.Name) returning varchar2(32767)), '$[0]'), '$[1]') c1, json_arrayagg(json_array(t1.ArtistId, t1.Name) returning varchar2(32767))
from Artist t1

