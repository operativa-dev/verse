-- Executing SQL: Parameters: []
select (
   select t4.Title
   from Album t4
   fetch next 1 rows only
) c0, t1.Name
from Artist t1

