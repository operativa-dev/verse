-- Executing SQL: Parameters: []
select (
   select json_array(json_query('[' + (string_agg(json_array("t3"."AlbumId", "t3"."Title", "t3"."ArtistId"), ',') + ']'), '$[0]'), json_query('[' + (string_agg(json_array("t3"."AlbumId", "t3"."Title", "t3"."ArtistId"), ',') + ']'), '$[1]')) as "c3"
   from "Album" as "t3"
   where "t1"."ArtistId" = "t3"."ArtistId"
) as "c4"
from "Artist" as "t1"

