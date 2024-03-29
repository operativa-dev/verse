-- Executing SQL: Parameters: [$1=5]
select "t1"."ArtistId", "t1"."Name", (
   select '[' + (string_agg(json_array("t3"."AlbumId", "t3"."Title", "t3"."ArtistId"), ',') + ']') as "c0"
   from "Album" as "t3"
   where "t1"."ArtistId" = "t3"."ArtistId"
) as "c1"
from "Artist" as "t1"
order by 1 offset 0 rows fetch next @p0 rows only

