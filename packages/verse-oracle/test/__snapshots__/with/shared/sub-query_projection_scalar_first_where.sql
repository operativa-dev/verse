-- Executing SQL: Parameters: []
select t1.ArtistId, t1.Name
from Artist t1
where (
   select t4.Title
   from Album t4
   fetch next 1 rows only
) = t1.Name

