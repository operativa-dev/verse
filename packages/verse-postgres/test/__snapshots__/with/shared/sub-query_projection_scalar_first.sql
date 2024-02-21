-- Executing SQL: Parameters: []
select (
   select "t5"."Title"
   from (
      select "t4"."Title"
      from (
         select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
         from "Album" as "t3"
         where "t3"."Title" like 'T%'
      ) as "t4"
   ) as "t5"
   limit 1
) as "c0"
from "Artist" as "t1"

