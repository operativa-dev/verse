-- Executing SQL: Parameters: []
select case when exists (
   select t0.AlbumId, t0.Title, t0.ArtistId
   from Album t0
) then 1 else 0 end
from DUAL

