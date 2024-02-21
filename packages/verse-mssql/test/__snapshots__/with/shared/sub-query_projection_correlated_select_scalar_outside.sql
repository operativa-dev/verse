-- Executing SQL: Parameters: []
select "t1"."Name", (
   select "t5"."Title"
   from (
      select "t4"."AlbumId", "t4"."Title", "t4"."ArtistId"
      from (
         select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
         from "Album" as "t3"
         where "t1"."ArtistId" = "t3"."ArtistId"
      ) as "t4"
      order by 1 offset 0 rows fetch next 1 rows only
   ) as "t5"
) as "c0"
from "Artist" as "t1"

