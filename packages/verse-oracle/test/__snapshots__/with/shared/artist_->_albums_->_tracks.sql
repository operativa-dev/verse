-- Executing SQL: Parameters: [$1=5]
select t3.ArtistId, t3.Name, t5.AlbumId, t5.Title, t5.ArtistId, t7.TrackId, t7.Name, t7.AlbumId, t7.GenreId, t7.Composer
from (
   select t2.ArtistId, t2.Name
   from Artist t2
   fetch next :0 rows only
) t3 
left join Album t5 on t3.ArtistId = t5.ArtistId 
left join Track t7 on t5.AlbumId = t7.AlbumId
order by t3.ArtistId, t5.AlbumId, t7.TrackId

