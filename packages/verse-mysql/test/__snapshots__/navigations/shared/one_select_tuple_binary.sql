-- Executing SQL: Parameters: []
select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`, (
   select json_array(`t2`.`ArtistId`, `t2`.`Name`) as `c0`
   from `Artist` as `t2`
   where `t1`.`ArtistId` = `t2`.`ArtistId`
) as `c1`, `t1`.`ArtistId` + 1 as `c2`
from `Album` as `t1`

