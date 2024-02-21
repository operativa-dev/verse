-- Executing SQL: Parameters: [$1='B%']
select "t2"."ArtistId", "t2"."Name", (
   select json_query(json_query("t7"."c0", '$[0]'), '$[1]') as "c1"
   from (
      select "t6"."c0"
      from (
         select '[' + (string_agg(json_array("t5"."AlbumId", "t5"."Title", "t5"."ArtistId"), ',') + ']') as "c0"
         from (
            select "t4"."AlbumId", "t4"."Title", "t4"."ArtistId"
            from "Album" as "t4"
            where "t4"."ArtistId" = "t2"."ArtistId"
         ) as "t5"
      ) as "t6"
      where json_query(json_query("t6"."c0", '$[0]'), '$[1]') like @p0
   ) as "t7"
) as "c2"
from (
   select "t1"."ArtistId", "t1"."Name"
   from "Artist" as "t1"
   order by 1 offset 0 rows fetch next 10 rows only
) as "t2"

