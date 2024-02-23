-- Executing SQL: Parameters: []
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId" as "c0"
from "Artist" as "t1" 
inner join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"

