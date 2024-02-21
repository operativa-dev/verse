-- Executing SQL: Parameters: [$1='Miles Davis']
select "t1"."TrackId", "t1"."Name", "t1"."AlbumId", "t1"."GenreId", "t1"."Composer"
from "Track" as "t1"
where ("t1"."Composer" <> $1) or ($1 is null and "t1"."Composer" is not null)

