-- Executing SQL: Parameters: [$1=1]
select json_query('[' + (string_agg(json_array("t2"."ArtistId", "t2"."Name"), ',') + ']'), '$[0]') as "c1"
from (
   select "t1"."ArtistId", "t1"."Name"
   from "Artist" as "t1"
   order by 1 offset 0 rows fetch next @p0 rows only
) as "t2"

