-- Executing SQL: Parameters: [$1='Eidolon', $2=1]
insert into "Album" ("Title", "ArtistId") output inserted."AlbumId" values (@p0, @p1)

-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
where "t1"."Title" = 'Eidolon'
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1='Sand', $2=1, $3=13]
update "Album" set "Title" = @p0, "ArtistId" = @p1 where "AlbumId" = @p2

-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
where "t1"."Title" = 'Sand'
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1=13]
delete from "Album" where "AlbumId" = @p0

