-- Executing SQL: Parameters: [$1='Miles Ahead']
select concat(concat('Hi ', `t1`.`Title`), '!') as `c0`, `t1`.`ArtistId` * 2 as `c1`
from `Album` as `t1`
where `t1`.`Title` = ?

