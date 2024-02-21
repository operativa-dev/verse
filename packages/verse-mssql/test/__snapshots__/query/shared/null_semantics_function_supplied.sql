-- Executing SQL: Parameters: [$1='Miles']
select "t1"."TrackId", "t1"."Name", "t1"."AlbumId", "t1"."GenreId", "t1"."Composer"
from "Track" as "t1"
where (substring("t1"."Composer", 0 + 1, 5) = @p0) or (substring("t1"."Composer", 0 + 1, 5) is null and @p0 is null)

