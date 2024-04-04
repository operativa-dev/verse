-- Executing SQL: Parameters: [$1=157, $2='Miles Ahead']
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId"
from (
   SELECT * FROM "Album" WHERE "AlbumId" = @p0
) as "t2"
where "t2"."Title" = @p1

