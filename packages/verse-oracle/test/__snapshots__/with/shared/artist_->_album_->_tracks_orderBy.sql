-- Executing SQL: Parameters: [$1=3]
select t4.ArtistId, t4.Name, t6.AlbumId, t6.Title, t6.ArtistId, t8.TrackId, t8.Name, t8.AlbumId, t8.GenreId, t8.Composer
from (
   select t3.ArtistId, t3.Name
   from Artist t3
   order by t3.Name
   fetch next :0 rows only
) t4 
left join Album t6 on t4.ArtistId = t6.ArtistId 
left join Track t8 on t6.AlbumId = t8.AlbumId
order by t4.Name, t4.ArtistId, t6.AlbumId, t8.TrackId

