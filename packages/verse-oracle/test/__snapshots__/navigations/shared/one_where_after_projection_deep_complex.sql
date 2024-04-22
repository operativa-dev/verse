-- Executing SQL: Parameters: []
select t2.AlbumId, t2.Title, t2.ArtistId, t2.c0, t2.c1, t2.c2
from (
   select t1.AlbumId, t1.Title, t1.ArtistId, t1.AlbumId c0, t1.Title c1, t1.ArtistId c2
   from Album t1
) t2 
inner join Artist t3 on t2.ArtistId = t3.ArtistId
where t3.Name = 'Alice In Chains'

