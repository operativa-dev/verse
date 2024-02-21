-- Executing SQL: Parameters: []
select "t5"."c1"
from (
   select '[' + (string_agg(json_array("t4"."AlbumId", "t4"."Title", "t4"."c0"), ',') + ']') as "c1"
   from (
      select "t1"."ArtistId", "t1"."Name", "t2"."AlbumId", "t2"."Title", "t2"."ArtistId" as "c0"
      from "Artist" as "t1" 
      left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
   ) as "t4"
   group by "t4"."ArtistId"
) as "t5"

