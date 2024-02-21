-- Executing SQL: Parameters: [$1=10]
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId"
from (
   select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
   from "Album" as "t1"
   where "t1"."AlbumId" > 5
) as "t2"
where "t2"."AlbumId" < @p0

