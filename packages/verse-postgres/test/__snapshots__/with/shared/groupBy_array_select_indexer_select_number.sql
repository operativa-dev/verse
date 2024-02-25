-- Executing SQL: Parameters: []
select cast((json_agg(json_build_array("t2"."AlbumId", "t2"."Title", "t2"."ArtistId")) -> 0) ->> 0 as integer) * 2 as "c4"
from "Artist" as "t1" 
left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
group by "t1"."ArtistId"

