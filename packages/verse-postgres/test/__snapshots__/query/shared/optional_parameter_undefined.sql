-- Executing SQL: Parameters: [$1=null]
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
where "t1"."Title" like ('%' || $1) || '%'

