-- Executing SQL: Parameters: [$1=5]
select t4.AlbumId, t4.Title, t4.ArtistId, t6.ArtistId, t6.Name
from (
   select t3.AlbumId, t3.Title, t3.ArtistId
   from Album t3
   order by t3.Title
   fetch next :0 rows only
) t4 
inner join Artist t6 on t4.ArtistId = t6.ArtistId
order by t4.Title

