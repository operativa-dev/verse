-- Executing SQL: Parameters: [$1='81', $2=1, $3=null]
insert into `Entity` (`Num`, `Bool`, `Date`) values (?, ?, ?)

-- Executing SQL: Parameters: []
select `t1`.`Num`, `t1`.`Bool`, `t1`.`Date`
from `Entity` as `t1`
where '81' = `t1`.`Num`
limit 2

