-- Executing SQL: Parameters: [$1=1]
select json_query(json_arrayagg(json_array(t1.ArtistId, t1.Name) returning varchar2(32767)), '$[0]') c1
from Artist t1
fetch next :0 rows only

