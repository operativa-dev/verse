-- Executing SQL: Parameters: []
select "t4"."c1"
from (
   select json_query(json_query("t3"."c0", '$[0]'), '$[1]') as "c1"
   from (
      select '[' + (string_agg(json_array("t2"."ArtistId", "t2"."Name"), ',') + ']') as "c0"
      from "Artist" as "t2"
   ) as "t3"
) as "t4"
where "t4"."c1" = 'AC/DC'

