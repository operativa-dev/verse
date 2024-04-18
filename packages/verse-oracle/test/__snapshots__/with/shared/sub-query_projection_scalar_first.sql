-- Executing SQL: Parameters: []
select (
   select t3.Title
   from Album t3
   where t3.Title like 'T%'
   fetch next 1 rows only
) c0
from Artist t1

