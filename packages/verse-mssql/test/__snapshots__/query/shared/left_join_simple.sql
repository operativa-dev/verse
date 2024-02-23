-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId", "t2"."ArtistId" as "c0", "t2"."Name"
from "Album" as "t1" 
left join "Artist" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
order by 1 offset 0 rows fetch next 3 rows only

