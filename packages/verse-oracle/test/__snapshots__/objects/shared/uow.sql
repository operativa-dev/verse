-- Executing SQL: Parameters: []
select "__verse_seqhilo".nextval
from DUAL

-- Executing SQL: Parameters: [$1=1, $2='Eidolon', $3=1]
insert into Album (AlbumId, Title, ArtistId) values (:0, :1, :2)

-- Executing SQL: Parameters: []
select t1.AlbumId, t1.Title, t1.ArtistId
from Album t1
where t1.Title = 'Eidolon'
fetch next 2 rows only

-- Executing SQL: Parameters: [$1='Sand', $2=1, $3=1]
update Album set Title = :0, ArtistId = :1 where AlbumId = :2

-- Executing SQL: Parameters: []
select t1.AlbumId, t1.Title, t1.ArtistId
from Album t1
where t1.Title = 'Sand'
fetch next 2 rows only

-- Executing SQL: Parameters: [$1=1]
delete from Album where AlbumId = :0

