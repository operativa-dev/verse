-- Executing SQL: Parameters: []
select "t4"."ArtistId", json_group_array(json_array("t4"."ArtistId", "t4"."Name", "t4"."AlbumId", "t4"."Title", "t4"."c0", 42, "t4"."Title")) as "c1"
from (
   select "t1"."ArtistId", "t1"."Name", "t2"."AlbumId", "t2"."Title", "t2"."ArtistId" as "c0"
   from "Artist" as "t1" 
   left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
) as "t4"
group by "t4"."ArtistId"

