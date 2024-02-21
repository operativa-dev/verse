-- Executing SQL: Parameters: []
select 42 as "c0"
from (
   select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
   from "Album" as "t1"
   limit 1
) as "t2"

