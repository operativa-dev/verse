-- Executing SQL: Parameters: []
select `t1`.`ArtistId`, `t1`.`Name`
from `Artist` as `t1`
where (
   select `t4`.`Title`
   from `Album` as `t4`
   limit 1
) = `t1`.`Name`

