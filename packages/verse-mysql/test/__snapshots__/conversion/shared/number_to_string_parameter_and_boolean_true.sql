-- Executing SQL: Parameters: [$1='42', $2=1, $3=null]
insert into `Entity` (`Num`, `Bool`, `Date`) values (?, ?, ?)

-- Executing SQL: Parameters: [$1='42']
select `t2`.`Num`, `t2`.`Bool`, `t2`.`Date`
from (
   select `t1`.`Num`, `t1`.`Bool`, `t1`.`Date`
   from `Entity` as `t1`
   where (`t1`.`Num` = ?) and `t1`.`Bool`
) as `t2`
limit 2

