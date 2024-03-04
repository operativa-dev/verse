-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1" 
inner join "Artist" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
where "t2"."Name" = 'Alice In Chains'

