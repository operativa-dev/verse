-- Executing SQL: Parameters: []
select t1.TrackId, t1.Name, t1.AlbumId, t1.GenreId, t1.Composer, t2.AlbumId c0, t2.Title, t2.ArtistId
from Track t1 
inner join Album t2 on t1.AlbumId = t2.AlbumId 
inner join Artist t5 on t2.ArtistId = t5.ArtistId
where t5.Name = 'Alice In Chains'

