-- Executing SQL: Parameters: []
select (
   select json_group_array("t5"."Title") as "c0"
   from (
      select "t4"."Title"
      from (
         select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
         from "Album" as "t3"
         where "t3"."Title" like 'T%'
      ) as "t4"
   ) as "t5"
) as "c1"
from "Artist" as "t1"

