-- Executing SQL: Parameters: [$1=157, $2='Miles Ahead']
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId"
from (
   SELECT * FROM "Album" WHERE "AlbumId" = $1
) as "t2"
where "t2"."Title" = $2

