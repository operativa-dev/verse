-- Executing SQL: Parameters: [$1=null]
select "t1"."TrackId", "t1"."Name", "t1"."AlbumId", "t1"."GenreId", "t1"."Composer"
from "Track" as "t1"
where (@p0 = substring("t1"."Composer", 0 + 1, 5)) or (@p0 is null and substring("t1"."Composer", 0 + 1, 5) is null)

