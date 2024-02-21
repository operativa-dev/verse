-- Executing SQL: Parameters: [$1=3]
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId"
from (
   select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
   from "Album" as "t1"
   offset $1
) as "t2"
limit 5

