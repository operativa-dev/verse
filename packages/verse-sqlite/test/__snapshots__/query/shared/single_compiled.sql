-- Executing SQL: Parameters: []
select "t3"."c0"
from (
   select ('Title: ' || "t2"."Title") || '!' as "c0"
   from (
      select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
      from "Album" as "t1"
      where "t1"."Title" = 'Miles Ahead'
   ) as "t2"
) as "t3"
limit 2

