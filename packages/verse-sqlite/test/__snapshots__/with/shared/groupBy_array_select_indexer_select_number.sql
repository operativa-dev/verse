-- Executing SQL: Parameters: []
select "t8"."c4"
from (
   select "t7"."c3" * 2 as "c4"
   from (
      select "t6"."c2" ->> 0 as "c3"
      from (
         select "t5"."c1" -> 0 as "c2"
         from (
            select json_group_array(json_array("t2"."AlbumId", "t2"."Title", "t2"."ArtistId")) as "c1"
            from "Artist" as "t1" 
            left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
            group by "t1"."ArtistId"
         ) as "t5"
      ) as "t6"
   ) as "t7"
) as "t8"

