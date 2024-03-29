-- Executing SQL: Parameters: [$1=3]
select 1 as "c0", "t1"."AlbumId"
from "Album" as "t1"
order by 1 offset 0 rows fetch next @p0 rows only

