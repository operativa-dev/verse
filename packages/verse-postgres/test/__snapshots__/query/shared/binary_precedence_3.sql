-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
where (("t1"."AlbumId" = 1) or ("t1"."AlbumId" = 2)) and ("t1"."ArtistId" = 3)

