-- Executing SQL: Parameters: [$1=5]
select "t3"."ArtistId", "t3"."Name", "t5"."AlbumId", "t5"."Title", "t5"."ArtistId", "t7"."TrackId", "t7"."Name", "t7"."AlbumId", "t7"."GenreId", "t7"."Composer", "t9"."PlaylistId", "t9"."TrackId"
from (
   select "t2"."ArtistId", "t2"."Name"
   from "Artist" as "t2"
   limit $1
) as "t3" 
left join "Album" as "t5" on "t3"."ArtistId" = "t5"."ArtistId" 
left join "Track" as "t7" on "t5"."AlbumId" = "t7"."AlbumId" 
left join "PlaylistTrack" as "t9" on "t7"."TrackId" = "t9"."TrackId"
order by "t3"."ArtistId", "t5"."AlbumId", "t7"."TrackId"

