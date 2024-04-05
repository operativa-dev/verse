-- Executing SQL: Parameters: [$1='Miles Ahead']
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId"
from (
   SELECT * FROM "Album" WHERE "AlbumId" = 157
) as "t2"
where "t2"."Title" = $1

