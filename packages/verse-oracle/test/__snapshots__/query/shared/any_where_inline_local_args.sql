-- Executing SQL: Parameters: [$1='Miles Ahead']
select case when exists (
   select t1.AlbumId, t1.Title, t1.ArtistId
   from Album t1
   where t1.Title = :0
) then 1 else 0 end
from DUAL

