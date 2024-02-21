-- Executing SQL: Parameters: [$1='Miles Davis']
select "t1"."TrackId", "t1"."Name", "t1"."AlbumId", "t1"."GenreId", "t1"."Composer"
from "Track" as "t1"
where ("t1"."Composer" = @p0) or ("t1"."Composer" is null and @p0 is null)

