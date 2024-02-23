-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
where "t1"."Title" = 'Miles Ahead'
order by 1 offset 0 rows fetch next 2 rows only

