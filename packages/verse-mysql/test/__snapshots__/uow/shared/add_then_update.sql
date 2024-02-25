-- Executing SQL: Parameters: [$1='MSFT']
insert into `Customer` (`Name`) values (?);
select `Id` from `Customer` where `Id` = last_insert_id()

-- Executing SQL: Parameters: [$1='Microsoft', $2=5]
update `Customer` set `Name` = ? where `Id` = ?

-- Executing SQL: Parameters: [$1=5]
select `t1`.`Id`, `t1`.`Name`
from `Customer` as `t1`
where `t1`.`Id` = ?
limit 2

