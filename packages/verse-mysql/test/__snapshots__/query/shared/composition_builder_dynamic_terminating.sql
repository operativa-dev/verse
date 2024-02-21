-- Executing SQL: Parameters: []
select max(`t2`.`AlbumId`)
from (
   select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`
   from `Album` as `t1`
   where `t1`.`AlbumId` > 5
) as `t2`

