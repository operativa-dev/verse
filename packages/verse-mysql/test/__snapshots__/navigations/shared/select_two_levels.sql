-- Executing SQL: Parameters: []
select (
   select `t3`.`Name`
   from `Album` as `t2` 
   inner join `Artist` as `t3` on `t2`.`ArtistId` = `t3`.`ArtistId`
   where `t1`.`AlbumId` = `t2`.`AlbumId`
) as `c0`
from `Track` as `t1`

