-- Executing SQL: Parameters: []
select "t5"."c0", "t5"."ArtistId", "t5"."Name", "t5"."c1", "t7"."AlbumId", "t7"."Title", "t7"."ArtistId"
from (
   select 42 as "c0", "t4"."ArtistId", "t4"."Name", 'abc' as "c1"
   from (
      select "t3"."ArtistId", "t3"."Name"
      from (
         select "t2"."ArtistId", "t2"."Name"
         from "Artist" as "t2"
         order by "t2"."Name" offset 0 rows
      ) as "t3"
      order by 1 offset 0 rows fetch next 50 rows only
   ) as "t4"
   order by "t4"."Name" offset 0 rows
) as "t5" 
left join "Album" as "t7" on "t5"."ArtistId" = "t7"."ArtistId"
order by "t5"."Name", "t5"."ArtistId"

