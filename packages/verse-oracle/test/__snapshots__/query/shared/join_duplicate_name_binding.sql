-- Executing SQL: Parameters: []
select t2.AlbumId, t2.Title, t2.ArtistId c0
from Artist t1 
inner join Album t2 on t1.ArtistId = t2.ArtistId

