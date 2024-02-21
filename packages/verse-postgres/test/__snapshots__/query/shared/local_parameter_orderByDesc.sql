-- Executing SQL: Parameters: [$1='Miles Ahead']
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
order by $1 desc

