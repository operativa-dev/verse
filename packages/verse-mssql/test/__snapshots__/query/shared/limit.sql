-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
order by 1 offset 0 rows fetch next 5 rows only

