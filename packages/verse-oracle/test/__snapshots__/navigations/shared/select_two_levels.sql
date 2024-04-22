-- Executing SQL: Parameters: []
select (
   select t3.Name
   from Album t2 
   inner join Artist t3 on t2.ArtistId = t3.ArtistId
   where t1.AlbumId = t2.AlbumId
) c0
from Track t1

