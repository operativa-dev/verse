-- Executing SQL: Parameters: [$1='a']
select t1.AlbumId, t1.Title, t1.ArtistId
from Album t1
where t1.Title like ('%' || :0) || '%'

