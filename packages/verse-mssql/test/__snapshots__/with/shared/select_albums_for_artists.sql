-- Executing SQL: Parameters: []
select "t5"."ArtistId", "t5"."Name", "t5"."c1"
from (
   select "t1"."ArtistId", "t1"."Name", (
      select '[' + (string_agg(json_array("t4"."AlbumId", "t4"."Title", "t4"."ArtistId"), ',') + ']') as "c0"
      from (
         select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
         from "Album" as "t3"
         where "t1"."ArtistId" = "t3"."ArtistId"
      ) as "t4"
   ) as "c1"
   from "Artist" as "t1"
) as "t5"
order by 1 offset 0 rows fetch next 5 rows only

