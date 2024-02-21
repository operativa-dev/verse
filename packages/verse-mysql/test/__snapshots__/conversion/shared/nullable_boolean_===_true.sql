-- Executing SQL: Parameters: [$1='78', $2=1, $3=null]
insert into `Entity` (`Num`, `Bool`, `Date`) values (?, ?, ?)

-- Executing SQL: Parameters: []
select `t2`.`Num`, `t2`.`Bool`, `t2`.`Date`
from (
   select `t1`.`Num`, `t1`.`Bool`, `t1`.`Date`
   from `Entity` as `t1`
   where (`t1`.`Num` = '78') and (`t1`.`Bool` = 1)
) as `t2`
limit 2

