-- Executing SQL: Parameters: [$1=10, $2=5]
select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId"
from (
   select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
   from "Album" as "t1"
   limit ?
) as "t2"
limit -1 offset ?

