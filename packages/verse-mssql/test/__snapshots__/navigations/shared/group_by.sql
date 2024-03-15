-- Executing SQL: Parameters: []
select '[' + (string_agg((
   select json_array("t2"."AlbumId", "t2"."Title", "t2"."ArtistId") as "c0"
   from "Album" as "t2"
   where "t1"."AlbumId" = "t2"."AlbumId"
), ',') + ']') as "c1"
from "Track" as "t1"
group by "t1"."AlbumId"

