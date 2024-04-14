-- Executing SQL: Parameters: [$1=3]
select t1.AlbumId, t1.Title, t1.ArtistId, t2.ArtistId c0, t2.Name
from Album t1 
left join Artist t2 on t1.ArtistId = t2.ArtistId
fetch next :0 rows only

