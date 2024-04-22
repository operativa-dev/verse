-- Executing SQL: Parameters: []
select t3.ArtistId, t3.Name, t5.AlbumId, t5.Title, t5.ArtistId, t7.TrackId, t7.Name, t7.AlbumId, t7.GenreId, t7.Composer, t9.PlaylistId, t9.TrackId
from (
   select t2.ArtistId, t2.Name
   from Artist t2
   where t2.ArtistId = 25
) t3 
left join Album t5 on t3.ArtistId = t5.ArtistId 
left join Track t7 on t5.AlbumId = t7.AlbumId 
left join PlaylistTrack t9 on t7.TrackId = t9.TrackId
order by t3.ArtistId, t5.AlbumId, t7.TrackId

