-- Executing SQL: Parameters: [$1='Miles Ahead']
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId"
from (
   select "t0"."AlbumId", "t0"."Title", "t0"."ArtistId"
   from (
      SELECT * FROM "Album" WHERE "AlbumId" = 157
   ) as "t0"
) as "t2"
where "t2"."Title" = @p0

