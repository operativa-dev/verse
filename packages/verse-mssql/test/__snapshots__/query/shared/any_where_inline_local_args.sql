-- Executing SQL: Parameters: [$1='Miles Ahead']
select iif(exists (
   select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
   from "Album" as "t1"
   where "t1"."Title" = @p0
), 1, 0)

