-- Executing SQL: Parameters: []
select (
   select json_arrayagg(json_array(`t2`.`AlbumId`, `t2`.`Title`, `t2`.`ArtistId`)) as `c0`
   from `Album` as `t2`
   where `t1`.`ArtistId` = `t2`.`ArtistId`
) as `c1`
from `Artist` as `t1`

