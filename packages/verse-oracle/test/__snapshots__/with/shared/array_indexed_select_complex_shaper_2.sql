-- Executing SQL: Parameters: []
select json_query(json_arrayagg(json_array(t1.ArtistId, t1.Name) returning varchar2(32767)), '$[0]') c1, json_query(json_query(json_arrayagg(json_array(t1.ArtistId, t1.Name) returning varchar2(32767)), '$[0]'), '$[1]') c2, json_query(json_arrayagg(json_array(t1.ArtistId, t1.Name) returning varchar2(32767)), '$[0]') c4, json_query(json_query(json_arrayagg(json_array(t1.ArtistId, t1.Name) returning varchar2(32767)), '$[0]'), '$[0]') c3
from Artist t1

