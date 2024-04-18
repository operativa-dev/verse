-- Executing SQL: Parameters: []
select t1.ArtistId, t1.Name
from Artist t1
where t1.ArtistId = (
   select t3.ArtistId
   from Album t3
   where (t1.ArtistId = t3.ArtistId) and (t1.Name = 'Buddy Guy')
   fetch next 2 rows only
)

