-- Executing SQL: Parameters: [$1='Miles Ahead', $2=157]
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId"
from (
   select "t0"."AlbumId", "t0"."Title", "t0"."ArtistId"
   from (
      SELECT * FROM "Album" WHERE "AlbumId" = $2
   ) as "t0"
) as "t2"
where "t2"."Title" = $1

