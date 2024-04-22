-- Executing SQL: Parameters: []
select t1.ArtistId, t1.Name
from Artist t1
where (
   select count(*)
   from Album t2
   where t1.ArtistId = t2.ArtistId
) > 1

