-- Executing SQL: Parameters: []
select "t1"."TrackId", "t1"."Name", "t1"."AlbumId", "t1"."GenreId", "t1"."Composer"
from "Track" as "t1"
where (
   select "t3"."Name"
   from "Album" as "t2" 
   inner join "Artist" as "t3" on "t2"."ArtistId" = "t3"."ArtistId"
   where "t1"."AlbumId" = "t2"."AlbumId"
) = 'Alice In Chains'

