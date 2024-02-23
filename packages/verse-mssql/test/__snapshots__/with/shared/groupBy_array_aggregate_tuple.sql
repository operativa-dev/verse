-- Executing SQL: Parameters: []
select "t1"."Name", '[' + (string_agg(json_array("t2"."Title", "t2"."AlbumId"), ',') + ']') as "c1"
from "Artist" as "t1" 
left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
group by "t1"."ArtistId", "t1"."Name"

