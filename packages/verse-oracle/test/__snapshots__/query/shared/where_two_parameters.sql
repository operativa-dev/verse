-- Executing SQL: Parameters: [$1='Miles Ahead', $2=42]
select t1.AlbumId, t1.Title, t1.ArtistId
from Album t1
where (t1.Title = :0) and (t1.AlbumId > :1)

