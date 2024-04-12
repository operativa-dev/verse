-- Executing SQL: Parameters: [$1='B%', $2=10]
select "t1"."ArtistId", "t1"."Name", (
   select ("t6"."c0" -> 0) ->> 1 as "c1"
   from (
      select json_agg(json_build_array("t4"."AlbumId", "t4"."Title", "t4"."ArtistId")) as "c0"
      from "Album" as "t4"
      where "t4"."ArtistId" = "t1"."ArtistId"
   ) as "t6"
   where ("t6"."c0" -> 0) ->> 1 like $1
) as "c2"
from "Artist" as "t1"
limit $2

