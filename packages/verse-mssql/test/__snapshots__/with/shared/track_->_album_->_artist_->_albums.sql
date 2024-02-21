-- Executing SQL: Parameters: []
select "t3"."TrackId", "t3"."Name", "t3"."AlbumId", "t3"."GenreId", "t3"."Composer", "t5"."AlbumId", "t5"."Title", "t5"."ArtistId", "t7"."ArtistId", "t7"."Name", "t9"."AlbumId", "t9"."Title", "t9"."ArtistId"
from (
   select "t2"."TrackId", "t2"."Name", "t2"."AlbumId", "t2"."GenreId", "t2"."Composer"
   from "Track" as "t2"
   order by 1 offset 0 rows fetch next 10 rows only
) as "t3" 
inner join "Album" as "t5" on "t3"."AlbumId" = "t5"."AlbumId" 
inner join "Artist" as "t7" on "t5"."ArtistId" = "t7"."ArtistId" 
left join "Album" as "t9" on "t7"."ArtistId" = "t9"."ArtistId"
order by "t7"."ArtistId"

