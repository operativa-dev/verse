-- Executing SQL: Parameters: []
select "t1"."Composer"
from "Track" as "t1" 
inner join "Album" as "t2" on "t1"."AlbumId" = "t2"."AlbumId"
order by "t1"."Composer"

