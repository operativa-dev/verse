-- Executing SQL: Parameters: []
select `t3`.`c0`
from (
   select concat(concat('Title: ', `t1`.`Title`), '!') as `c0`
   from `Album` as `t1`
   where `t1`.`Title` = 'Miles Ahead'
) as `t3`
limit 2

