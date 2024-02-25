-- Executing SQL: Parameters: []
select `t1`.`Name`, (
   select json_array(`t3`.`AlbumId`, `t3`.`Title`, `t3`.`ArtistId`) as `c0`
   from `Album` as `t3`
   where `t1`.`ArtistId` = `t3`.`ArtistId`
   limit 1
) as `c1`
from `Artist` as `t1`

