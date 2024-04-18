-- Executing SQL: Parameters: []
select json_arrayagg(t2.Name returning varchar2(32767)) c0
from Artist t2

