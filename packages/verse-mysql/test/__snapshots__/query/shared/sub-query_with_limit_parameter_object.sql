-- Executing SQL: Parameters: [$1=1]
select (
   select json_array(`t4`.`AlbumId`, `t4`.`Title`, `t4`.`ArtistId`) as `c0`
   from (
      select `t3`.`AlbumId`, `t3`.`Title`, `t3`.`ArtistId`
      from `Album` as `t3`
      limit ?
   ) as `t4`
   limit 1
) as `c1`
from `Artist` as `t1`

