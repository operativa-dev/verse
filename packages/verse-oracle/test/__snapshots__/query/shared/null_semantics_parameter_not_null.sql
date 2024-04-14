-- Executing SQL: Parameters: [$1=null]
select t1.TrackId, t1.Name, t1.AlbumId, t1.GenreId, t1.Composer
from Track t1
where (t1.Composer <> :0) or (:0 is null and t1.Composer is not null)

