-- Executing SQL: Parameters: []
select "t2"."ArtistId" as "c0", "t2"."Name", "t2"."ArtistId" as "c1", "t2"."Name" as "c2"
from "Album" as "t1" 
inner join "Artist" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"

