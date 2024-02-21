-- Executing SQL: Parameters: [$1=1]
select "t0"."AlbumId", "t0"."Title", "t0"."ArtistId"
from (
   select * from "Album" where "AlbumId" = $1
) as "t0"

