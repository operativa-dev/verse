-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId", "t2"."ArtistId" as "c0", "t2"."Name", "t1"."ArtistId" + 1 as "c1"
from "Album" as "t1" 
inner join "Artist" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"

