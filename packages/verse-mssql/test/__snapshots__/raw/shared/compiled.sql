-- Executing SQL: Parameters: [$1='Miles Ahead', $2=157]
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId"
from (
   SELECT * FROM "Album" WHERE "AlbumId" = @p1
) as "t2"
where "t2"."Title" = @p0

