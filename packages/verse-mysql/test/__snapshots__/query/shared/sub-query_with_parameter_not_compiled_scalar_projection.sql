-- Executing SQL: Parameters: [$1=1]
select (
   select json_array(`t5`.`AlbumId`, `t5`.`Title`, `t5`.`ArtistId`) as `c0`
   from (
      select `t4`.`AlbumId`, `t4`.`Title`, `t4`.`ArtistId`
      from `Album` as `t4`
      limit ?
   ) as `t5`
   where `t5`.`ArtistId` = `t2`.`ArtistId`
) as `c1`
from `Artist` as `t2`

