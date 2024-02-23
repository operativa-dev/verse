-- Executing SQL: Parameters: []
select (
   select json_array("t3"."AlbumId", "t3"."Title", "t3"."ArtistId") as "c0"
   from "Album" as "t3"
   order by 1 offset 0 rows fetch next 1 rows only
) as "c1"
from "Artist" as "t1"

