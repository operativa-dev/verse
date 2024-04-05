-- Executing SQL: Parameters: [$1=5]
select "t4"."AlbumId", "t4"."Title", "t4"."ArtistId", "t6"."ArtistId", "t6"."Name"
from (
   select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
   from "Album" as "t3"
   order by "t3"."Title" offset 0 rows fetch next @p0 rows only
) as "t4" 
inner join "Artist" as "t6" on "t4"."ArtistId" = "t6"."ArtistId"
order by "t4"."Title"

