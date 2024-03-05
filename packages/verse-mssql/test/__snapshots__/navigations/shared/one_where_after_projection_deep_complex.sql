-- Executing SQL: Parameters: []
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId", "t2"."c0", "t2"."c1", "t2"."c2"
from (
   select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId", "t1"."AlbumId" as "c0", "t1"."Title" as "c1", "t1"."ArtistId" as "c2"
   from "Album" as "t1"
) as "t2" 
inner join "Artist" as "t3" on "t2"."ArtistId" = "t3"."ArtistId"
where "t3"."Name" = 'Alice In Chains'

