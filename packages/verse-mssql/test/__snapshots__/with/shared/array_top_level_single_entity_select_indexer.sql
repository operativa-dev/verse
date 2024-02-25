-- Executing SQL: Parameters: []
select json_query('[' + (string_agg(json_array("t2"."ArtistId", "t2"."Name"), ',') + ']'), '$[0]') as "c1"
from "Artist" as "t2"

