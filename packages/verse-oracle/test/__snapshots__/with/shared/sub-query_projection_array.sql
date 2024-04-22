-- Executing SQL: Parameters: []
select (
   select json_arrayagg(t3.Title returning varchar2(32767)) c0
   from Album t3
   where t3.Title like 'T%'
) c1
from Artist t1

