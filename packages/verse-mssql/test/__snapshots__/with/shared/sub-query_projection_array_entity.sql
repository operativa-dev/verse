-- Executing SQL: Parameters: []
select "t2"."ArtistId", "t2"."Name", (
   select '[' + (string_agg(json_array("t5"."AlbumId", "t5"."Title", "t5"."ArtistId"), ',') + ']') as "c0"
   from (
      select "t4"."AlbumId", "t4"."Title", "t4"."ArtistId"
      from "Album" as "t4"
      where "t2"."ArtistId" = "t4"."ArtistId"
   ) as "t5"
) as "c1"
from (
   select "t1"."ArtistId", "t1"."Name"
   from "Artist" as "t1"
   order by 1 offset 0 rows fetch next 5 rows only
) as "t2"

