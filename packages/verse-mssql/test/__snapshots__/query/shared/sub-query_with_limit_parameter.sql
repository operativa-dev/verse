-- Executing SQL: Parameters: [$1=1]
select (
   select json_array("t4"."AlbumId", "t4"."Title", "t4"."ArtistId") as "c0"
   from (
      select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
      from "Album" as "t3"
      order by 1 offset 0 rows fetch next @p0 rows only
   ) as "t4"
   order by 1 offset 0 rows fetch next 1 rows only
) as "c1"
from "Artist" as "t1"

