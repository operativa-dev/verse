-- Executing SQL: Parameters: []
select json_query(json_query("t2"."c0", '$[0]'), '$[1]') as "c1", "t2"."c0"
from (
   select '[' + (string_agg(json_array("t1"."ArtistId", "t1"."Name"), ',') + ']') as "c0"
   from "Artist" as "t1"
) as "t2"

