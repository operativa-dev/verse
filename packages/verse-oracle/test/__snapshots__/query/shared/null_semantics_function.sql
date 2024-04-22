-- Executing SQL: Parameters: [$1=null]
select t1.TrackId, t1.Name, t1.AlbumId, t1.GenreId, t1.Composer
from Track t1
where (substr(t1.Composer, 0 + 1, 5) = :0) or (substr(t1.Composer, 0 + 1, 5) is null and :0 is null)

