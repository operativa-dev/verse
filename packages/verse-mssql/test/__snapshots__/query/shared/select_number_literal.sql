-- Executing SQL: Parameters: []
select 42 as "c0"
from (
   select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
   from "Album" as "t1"
   order by 1 offset 0 rows fetch next 1 rows only
) as "t2"

