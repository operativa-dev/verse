-- Executing SQL: Parameters: []
select (
   select "t8"."c1"
   from (
      select "t7"."c0" ->> 0 as "c1"
      from (
         select json_group_array("t6"."Title") as "c0"
         from (
            select "t5"."Title"
            from (
               select "t4"."Title"
               from (
                  select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
                  from "Album" as "t3"
                  where "t3"."Title" like 'T%'
               ) as "t4"
            ) as "t5"
            limit 5
         ) as "t6"
      ) as "t7"
   ) as "t8"
   order by "t8"."c1"
) as "c2"
from "Artist" as "t1"

