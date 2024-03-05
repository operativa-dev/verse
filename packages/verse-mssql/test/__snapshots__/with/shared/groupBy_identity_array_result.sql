-- Executing SQL: Parameters: []
select '[' + (string_agg(json_array("t1"."AlbumId", "t1"."Title", "t1"."ArtistId"), ',') + ']') as "c0"
from "Album" as "t1"
group by "t1"."ArtistId"

