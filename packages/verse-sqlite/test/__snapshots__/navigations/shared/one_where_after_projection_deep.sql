-- Executing SQL: Parameters: []
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId", "t3"."ArtistId" as "c0", "t3"."Name"
from "Album" as "t2" 
inner join "Artist" as "t3" on "t2"."ArtistId" = "t3"."ArtistId"
where "t3"."Name" = 'Alice In Chains'

