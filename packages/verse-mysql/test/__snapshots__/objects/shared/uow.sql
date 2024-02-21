-- Executing SQL: Parameters: [$1='Eidolon', $2=1]
insert into `Album` (`Title`, `ArtistId`) values (?, ?);
select `AlbumId` from `Album` where `AlbumId` = last_insert_id()

-- Executing SQL: Parameters: []
select `t2`.`AlbumId`, `t2`.`Title`, `t2`.`ArtistId`
from (
   select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`
   from `Album` as `t1`
   where `t1`.`Title` = 'Eidolon'
) as `t2`
limit 2

-- Executing SQL: Parameters: [$1='Sand', $2=1, $3=13]
update `Album` set `Title` = ?, `ArtistId` = ? where `AlbumId` = ?

-- Executing SQL: Parameters: []
select `t2`.`AlbumId`, `t2`.`Title`, `t2`.`ArtistId`
from (
   select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`
   from `Album` as `t1`
   where `t1`.`Title` = 'Sand'
) as `t2`
limit 2

-- Executing SQL: Parameters: [$1=13]
delete from `Album` where `AlbumId` = ?

