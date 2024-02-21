-- Executing SQL: Parameters: []
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId", "t4"."TrackId", "t4"."Name", "t4"."AlbumId", "t4"."GenreId", "t4"."Composer"
from "Album" as "t2" 
left join "Track" as "t4" on "t2"."AlbumId" = "t4"."AlbumId"
order by "t2"."AlbumId", "t4"."TrackId"

