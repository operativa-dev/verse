-- Executing SQL: Parameters: [$1=10]
select t4.TrackId, t4.Name, t4.AlbumId, t4.GenreId, t4.Composer, t6.AlbumId, t6.Title, t6.ArtistId, t8.GenreId, t8.Name
from (
   select t3.TrackId, t3.Name, t3.AlbumId, t3.GenreId, t3.Composer
   from Track t3
   fetch next :0 rows only
) t4 
inner join Genre t8 on t4.GenreId = t8.GenreId 
inner join Album t6 on t4.AlbumId = t6.AlbumId

