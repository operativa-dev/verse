-- Executing SQL: Parameters: []
select nextval('__verse_seqhilo')

-- Executing SQL: Parameters: [$1=1, $2='Eidolon', $3=1]
insert into "Album" ("AlbumId", "Title", "ArtistId") values ($1, $2, $3)

-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
where "t1"."Title" = 'Eidolon'
limit 2

-- Executing SQL: Parameters: [$1='Sand', $2=1, $3=1]
update "Album" set "Title" = $1, "ArtistId" = $2 where "AlbumId" = $3

-- Executing SQL: Parameters: []
select "t1"."AlbumId", "t1"."Title", "t1"."ArtistId"
from "Album" as "t1"
where "t1"."Title" = 'Sand'
limit 2

-- Executing SQL: Parameters: [$1=1]
delete from "Album" where "AlbumId" = $1

