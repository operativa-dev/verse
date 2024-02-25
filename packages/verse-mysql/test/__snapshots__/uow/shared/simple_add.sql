-- Executing SQL: Parameters: [$1='ACME Inc.']
insert into `Customer` (`Name`) values (?);
select `Id` from `Customer` where `Id` = last_insert_id()

-- Executing SQL: Parameters: [$1=4]
select `t1`.`Id`, `t1`.`Name`
from `Customer` as `t1`
where `t1`.`Id` = ?
limit 2

-- Executing SQL: Parameters: [$1=4]
select `t1`.`Id`, `t1`.`Name`
from `Customer` as `t1`
where `t1`.`Id` = ?
limit 1

