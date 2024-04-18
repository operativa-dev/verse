-- Executing SQL: Parameters: []
select t1.Name, (
   select t3.Title
   from Album t3
   where t1.ArtistId = t3.ArtistId
   fetch next 1 rows only
) c0
from Artist t1

