-- Executing SQL: Parameters: []
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId"
from (
   select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
   from "Album" as "t1"
   order by 1 offset 0 rows fetch next 10 rows only
) as "t2"
order by 1 offset 5 rows

