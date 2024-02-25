-- Executing SQL: Parameters: []
select json_query('[' + (string_agg(json_array("t2"."AlbumId", "t2"."Title", "t2"."ArtistId"), ',') + ']'), '$[0]') as "c2"
from "Artist" as "t1" 
left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
group by "t1"."ArtistId"

