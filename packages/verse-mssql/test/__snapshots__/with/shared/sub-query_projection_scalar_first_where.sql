-- Executing SQL: Parameters: []
select "t1"."ArtistId", "t1"."Name"
from "Artist" as "t1"
where (
   select "t4"."Title"
   from "Album" as "t4"
   order by 1 offset 0 rows fetch next 1 rows only
) = "t1"."Name"

