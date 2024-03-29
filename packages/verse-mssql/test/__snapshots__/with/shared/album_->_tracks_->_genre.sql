-- Executing SQL: Parameters: [$1=5]
select "t4"."AlbumId", "t4"."Title", "t4"."ArtistId", "t6"."TrackId", "t6"."Name", "t6"."AlbumId", "t6"."GenreId", "t6"."Composer", "t8"."GenreId", "t8"."Name"
from (
   select "t3"."AlbumId", "t3"."Title", "t3"."ArtistId"
   from (
      select "t2"."AlbumId", "t2"."Title", "t2"."ArtistId"
      from "Album" as "t2"
      order by "t2"."Title" offset 0 rows
   ) as "t3"
   order by "t3"."Title" offset 0 rows fetch next @p0 rows only
) as "t4" 
left join "Track" as "t6" on "t4"."AlbumId" = "t6"."AlbumId" 
inner join "Genre" as "t8" on "t6"."GenreId" = "t8"."GenreId"
order by "t4"."Title", "t4"."AlbumId", "t6"."TrackId"

