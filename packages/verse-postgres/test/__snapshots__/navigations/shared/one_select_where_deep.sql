-- Executing SQL: Parameters: []
select "t6"."Name" as "c0"
from "Album" as "t2" 
inner join "Artist" as "t6" on "t2"."ArtistId" = "t6"."ArtistId" 
inner join "Artist" as "t3" on "t2"."ArtistId" = "t3"."ArtistId"
where "t3"."Name" = 'Alice In Chains'

