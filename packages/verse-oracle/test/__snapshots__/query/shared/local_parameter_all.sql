-- Executing SQL: Parameters: [$1=0]
select case when not (exists (
   select t1.AlbumId, t1.Title, t1.ArtistId
   from Album t1
   where not (t1.AlbumId > :0)
)) then 1 else 0 end
from DUAL

