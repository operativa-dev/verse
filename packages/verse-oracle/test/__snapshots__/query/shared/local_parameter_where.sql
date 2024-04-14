-- Executing SQL: Parameters: [$1='Miles Ahead']
select t1.AlbumId, t1.Title, t1.ArtistId
from Album t1
where t1.Title = :0

