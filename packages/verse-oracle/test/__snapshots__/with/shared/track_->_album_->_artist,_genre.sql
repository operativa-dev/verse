-- Executing SQL: Parameters: [$1=10]
select t4.TrackId, t4.Name, t4.AlbumId, t4.GenreId, t4.Composer, t6.AlbumId, t6.Title, t6.ArtistId, t8.ArtistId, t8.Name, t10.GenreId, t10.Name
from (
   select t3.TrackId, t3.Name, t3.AlbumId, t3.GenreId, t3.Composer
   from Track t3
   fetch next :0 rows only
) t4 
inner join Genre t10 on t4.GenreId = t10.GenreId 
inner join Album t6 on t4.AlbumId = t6.AlbumId 
inner join Artist t8 on t6.ArtistId = t8.ArtistId

