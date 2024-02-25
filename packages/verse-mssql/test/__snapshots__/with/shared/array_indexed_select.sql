-- Executing SQL: Parameters: []
select json_query(json_query('[' + (string_agg(json_array("t1"."ArtistId", "t1"."Name"), ',') + ']'), '$[0]'), '$[1]') as "c1", '[' + (string_agg(json_array("t1"."ArtistId", "t1"."Name"), ',') + ']')
from "Artist" as "t1"

