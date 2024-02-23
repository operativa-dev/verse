-- Executing SQL: Parameters: []
select "t1"."ArtistId", json_agg(json_build_array("t2"."AlbumId", "t2"."Title", "t2"."ArtistId")) as "c1"
from "Artist" as "t1" 
left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
group by "t1"."ArtistId"

