-- Executing SQL: Parameters: []
select "t5"."c1"
from (
   select '[' + (string_agg(trim('[]' from json_modify('[]', 'append $', "t4"."Title")), ',') + ']') as "c1"
   from (
      select "t1"."ArtistId", "t1"."Name", "t2"."AlbumId", "t2"."Title", "t2"."ArtistId" as "c0"
      from "Artist" as "t1" 
      left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
   ) as "t4"
   group by "t4"."ArtistId"
) as "t5"
where json_query("t5"."c1", '$[0]') like 'T%'

