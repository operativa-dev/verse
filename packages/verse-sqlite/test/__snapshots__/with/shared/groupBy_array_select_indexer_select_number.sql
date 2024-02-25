-- Executing SQL: Parameters: []
select ((json_group_array(json_array("t2"."AlbumId", "t2"."Title", "t2"."ArtistId")) -> 0) ->> 0) * 2 as "c4"
from "Artist" as "t1" 
left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
group by "t1"."ArtistId"

