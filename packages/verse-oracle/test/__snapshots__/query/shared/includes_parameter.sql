-- Executing SQL: Parameters: [$1='B%', $2=2, $3=12]
select t1.AlbumId, t1.Title, t1.ArtistId
from Album t1
where t1.Title like :0 and t1.ArtistId in (:1, :2)

