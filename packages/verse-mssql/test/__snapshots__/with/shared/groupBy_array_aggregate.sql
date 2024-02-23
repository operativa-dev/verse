-- Executing SQL: Parameters: []
select '[' + (string_agg(trim('[]' from json_modify('[]', 'append $', "t2"."Title")), ',') + ']') as "c1"
from "Artist" as "t1" 
left join "Album" as "t2" on "t1"."ArtistId" = "t2"."ArtistId"
group by "t1"."ArtistId"

