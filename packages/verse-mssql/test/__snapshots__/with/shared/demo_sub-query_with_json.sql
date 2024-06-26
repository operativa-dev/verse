-- Executing SQL: Parameters: [$1='B%', $2=10]
select "t1"."ArtistId", "t1"."Name", (
   select json_query(json_query("t6"."c0", '$[0]'), '$[1]') as "c1"
   from (
      select '[' + (string_agg(json_array("t4"."AlbumId", "t4"."Title", "t4"."ArtistId"), ',') + ']') as "c0"
      from "Album" as "t4"
      where "t4"."ArtistId" = "t1"."ArtistId"
   ) as "t6"
   where json_query(json_query("t6"."c0", '$[0]'), '$[1]') like @p0
) as "c2"
from "Artist" as "t1"
order by 1 offset 0 rows fetch next @p1 rows only

