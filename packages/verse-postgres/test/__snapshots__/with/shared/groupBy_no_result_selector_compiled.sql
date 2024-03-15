-- Executing SQL: Parameters: []
select "t1"."ArtistId", json_agg(json_build_array("t1"."AlbumId", "t1"."Title", "t1"."ArtistId")) as "c0"
from "Album" as "t1"
group by "t1"."ArtistId"

