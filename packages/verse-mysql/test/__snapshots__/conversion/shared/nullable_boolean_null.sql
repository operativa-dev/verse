-- Executing SQL: Parameters: [$1='99', $2=null, $3=null]
insert into `Entity` (`Num`, `Bool`, `Date`) values (?, ?, ?)

-- Executing SQL: Parameters: []
select `t2`.`Num`, `t2`.`Bool`, `t2`.`Date`
from (
   select `t1`.`Num`, `t1`.`Bool`, `t1`.`Date`
   from `Entity` as `t1`
   where (`t1`.`Num` = '99') and `t1`.`Bool` is null
) as `t2`
limit 2

