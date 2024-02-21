-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
where substring("t1"."Title", 0 + 1, 3) = 'Mil'

