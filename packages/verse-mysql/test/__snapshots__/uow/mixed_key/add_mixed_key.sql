-- Executing SQL: Parameters: [$1='foo', $2='foo']
insert into `MixedKey` (`Other`) values (?);
select `Id` from `MixedKey` where (`Id` = last_insert_id()) and (`Other` = ?)

-- Executing SQL: Parameters: [$1=1]
select `t2`.`Id`, `t2`.`Other`
from (
   select `t1`.`Id`, `t1`.`Other`
   from `MixedKey` as `t1`
   where (`t1`.`Id` = ?) and (`t1`.`Other` = 'foo')
) as `t2`
limit 2

-- Executing SQL: Parameters: [$1=1]
select `t2`.`Id`, `t2`.`Other`
from (
   select `t1`.`Id`, `t1`.`Other`
   from `MixedKey` as `t1`
   where (`t1`.`Id` = ?) and (`t1`.`Other` = 'foo')
) as `t2`
limit 1

