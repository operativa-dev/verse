-- Executing SQL: Parameters: []
select "t6"."c1"
from (
   select "t5"."c1"
   from (
      select '[' + (string_agg(json_array("t2"."AlbumId", "t2"."Title", "t2"."ArtistId"), ',') + ']') as "c1"
      from "Artist" as "t1" 
      left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
      group by "t1"."ArtistId"
   ) as "t5"
) as "t6"

