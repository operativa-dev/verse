-- Executing SQL: Parameters: []
select iif(exists (
   select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
   from "Album" as "t1"
   where "t1"."Title" = 'Miles Ahead'
), 1, 0)

