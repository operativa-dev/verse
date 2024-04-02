-- Executing SQL: Parameters: [$1=3]
select "t4"."ArtistId", "t4"."Name", "t6"."AlbumId", "t6"."Title", "t6"."ArtistId", "t8"."TrackId", "t8"."Name", "t8"."AlbumId", "t8"."GenreId", "t8"."Composer"
from (
   select "t3"."ArtistId", "t3"."Name"
   from (
      select "t2"."ArtistId", "t2"."Name"
      from "Artist" as "t2"
      order by "t2"."Name"
   ) as "t3"
   order by "t3"."Name"
   limit ?
) as "t4" 
left join "Album" as "t6" on "t4"."ArtistId" = "t6"."ArtistId" 
left join "Track" as "t8" on "t6"."AlbumId" = "t8"."AlbumId"
order by "t4"."Name", "t4"."ArtistId", "t6"."AlbumId", "t8"."TrackId"

