-- Executing SQL: Parameters: []
select json_query(json_arrayagg(json_array(t2.ArtistId, t2.Name) returning varchar2(32767)), '$[0]') c1
from Artist t2

