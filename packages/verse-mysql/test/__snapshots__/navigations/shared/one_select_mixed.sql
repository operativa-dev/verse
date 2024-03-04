-- Executing SQL: Parameters: []
select (
   select json_array(`t2`.`ArtistId`, `t2`.`Name`) as `c0`
   from `Artist` as `t2`
   where `t1`.`ArtistId` = `t2`.`ArtistId`
) as `c1`, `t1`.`Title`
from `Album` as `t1`

