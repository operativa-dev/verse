-- Executing SQL: Parameters: []
select "t5"."AlbumId", "t5"."Title", "t5"."ArtistId", "t5"."c0", "t5"."c1", "t5"."c2", "t5"."c3", "t5"."Name"
from (
   select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId", "t2"."c0", "t2"."c1", "t2"."c2", "t3"."ArtistId" as "c3", "t3"."Name"
   from (
      select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId", "t1"."AlbumId" as "c0", "t1"."Title" as "c1", "t1"."ArtistId" as "c2"
      from "Album" as "t1"
   ) as "t2" 
   inner join "Artist" as "t3" on "t2"."ArtistId" = "t3"."ArtistId"
) as "t5"
where "t5"."Name" = 'Alice In Chains'

