-- Executing SQL: Parameters: []
select "t8"."c3"
from (
   select "t7"."c3"
   from (
      select json_query("t6"."c2", '$[1]') as "c3"
      from (
         select json_query("t5"."c1", '$[0]') as "c2"
         from (
            select '[' + (string_agg(json_array("t4"."AlbumId", "t4"."Title", "t4"."c0"), ',') + ']') as "c1"
            from (
               select "t1"."ArtistId", "t1"."Name", "t2"."AlbumId", "t2"."Title", "t2"."ArtistId" as "c0"
               from "Artist" as "t1" 
               left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
            ) as "t4"
            group by "t4"."ArtistId"
         ) as "t5"
      ) as "t6"
   ) as "t7"
   where "t7"."c3" like 'T%'
) as "t8"

