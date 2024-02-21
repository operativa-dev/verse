-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
where substr("t1"."Title", 0 + 1, 3) = 'Mil'

