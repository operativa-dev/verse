-- Executing SQL: Parameters: []
select concat(concat('Title: ', `t1`.`Title`), '!') as `c0`
from `Album` as `t1`
where `t1`.`Title` = 'Miles Ahead'
limit 2

