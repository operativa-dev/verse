-- Executing SQL: Parameters: []
select t8.ArtistId, json_arrayagg(json_array(t8.TrackId, t8.Name, t8.AlbumId, t8.GenreId, t8.Composer, t8.c0, t8.Title, t8.ArtistId, t8.c1, t8.c2)) c3
from (
   select t5.TrackId, t5.Name, t5.AlbumId, t5.GenreId, t5.Composer, t5.c0, t5.Title, t5.ArtistId, t6.ArtistId c1, t6.Name c2
   from (
      select t2.TrackId, t2.Name, t2.AlbumId, t2.GenreId, t2.Composer, t3.AlbumId c0, t3.Title, t3.ArtistId
      from (
         select t1.TrackId, t1.Name, t1.AlbumId, t1.GenreId, t1.Composer
         from Track t1
         where t1.AlbumId = 42
      ) t2 
      inner join Album t3 on t2.AlbumId = t3.AlbumId
   ) t5 
   inner join Artist t6 on t5.ArtistId = t6.ArtistId
) t8
group by t8.ArtistId

