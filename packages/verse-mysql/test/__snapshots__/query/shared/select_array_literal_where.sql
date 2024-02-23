-- Executing SQL: Parameters: [$1='Miles Ahead']
select `t3`.`c0`, `t3`.`c1`
from (
   select concat(concat('Hi ', `t1`.`Title`), '!') as `c0`, `t1`.`ArtistId` * 2 as `c1`
   from `Album` as `t1`
   where `t1`.`Title` = ?
) as `t3`
where `t3`.`c1` > 12

