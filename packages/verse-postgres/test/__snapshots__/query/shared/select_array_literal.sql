-- Executing SQL: Parameters: []
select "t2"."c0", "t2"."AlbumId"
from (
   select 1 as "c0", "t1"."AlbumId"
   from "Album" as "t1"
) as "t2"
limit 3

