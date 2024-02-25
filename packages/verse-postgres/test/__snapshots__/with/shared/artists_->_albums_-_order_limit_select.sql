-- Executing SQL: Parameters: []
select "t5"."c0", "t5"."ArtistId", "t5"."Name", "t5"."c1", "t7"."AlbumId", "t7"."Title", "t7"."ArtistId"
from (
   select 42 as "c0", "t4"."ArtistId", "t4"."Name", 'abc' as "c1"
   from (
      select "t2"."ArtistId", "t2"."Name"
      from "Artist" as "t2"
      order by "t2"."Name"
      limit 50
   ) as "t4"
   order by "t4"."Name"
) as "t5" 
left join "Album" as "t7" on "t5"."ArtistId" = "t7"."ArtistId"
order by "t5"."Name", "t5"."ArtistId"

