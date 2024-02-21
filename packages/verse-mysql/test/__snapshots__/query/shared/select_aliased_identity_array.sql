-- Executing SQL: Parameters: []
select `t2`.`c0`, `t2`.`Title`
from (
   select `t1`.`AlbumId` * 2 as `c0`, `t1`.`Title`
   from `Album` as `t1`
) as `t2`

