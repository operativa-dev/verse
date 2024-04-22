-- Executing SQL: Parameters: []
select t1.AlbumId, t1.Title, t1.ArtistId, t2.ArtistId c0, t2.Name
from Album t1 
inner join Artist t2 on t1.ArtistId = t2.ArtistId
order by t2.ArtistId

