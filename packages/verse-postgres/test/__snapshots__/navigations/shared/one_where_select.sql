-- Executing SQL: Parameters: []
select "t5"."Name" as "c0"
from "Album" as "t1" 
inner join "Artist" as "t5" on "t1"."ArtistId" = "t5"."ArtistId" 
inner join "Artist" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
where "t2"."Name" = 'Alice In Chains'

