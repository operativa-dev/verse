-- Executing SQL: Parameters: [$1=null]
select t1.TrackId, t1.Name, t1.AlbumId, t1.GenreId, t1.Composer
from Track t1
where (:0 = t1.Composer) or (:0 is null and t1.Composer is null)

