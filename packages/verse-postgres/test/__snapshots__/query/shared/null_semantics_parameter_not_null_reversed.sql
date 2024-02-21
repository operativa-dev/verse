-- Executing SQL: Parameters: [$1=null]
select "t1"."TrackId", "t1"."Name", "t1"."AlbumId", "t1"."GenreId", "t1"."Composer"
from "Track" as "t1"
where ($1 <> "t1"."Composer") or ($1 is null and "t1"."Composer" is not null)

