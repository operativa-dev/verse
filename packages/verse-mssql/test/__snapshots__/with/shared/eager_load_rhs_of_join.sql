-- Executing SQL: Parameters: []
select "t6"."ArtistId", "t6"."Name", "t6"."AlbumId", "t6"."Title", "t6"."c0", "t8"."TrackId", "t8"."Name", "t8"."AlbumId", "t8"."GenreId", "t8"."Composer"
from (
   select "t5"."ArtistId", "t5"."Name", "t5"."AlbumId", "t5"."Title", "t5"."c0"
   from (
      select "t1"."ArtistId", "t1"."Name", "t2"."AlbumId", "t2"."Title", "t2"."ArtistId" as "c0"
      from "Artist" as "t1" 
      left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
   ) as "t5"
   order by 1 offset 0 rows fetch next 5 rows only
) as "t6" 
left join "Track" as "t8" on "t6"."AlbumId" = "t8"."AlbumId"
order by "t6"."AlbumId", "t8"."TrackId"

