-- Executing SQL: Parameters: []
select `t1`.`Id`, `t1`.`Name`
from `Customer` as `t1`
where `t1`.`Name` = 'Customer 2'
limit 2

-- Executing SQL: Parameters: [$1='Customer 2b', $2=<UUID>]
update `Customer` set `Name` = ? where `Id` = ?

-- Executing SQL: Parameters: [$1=<UUID>]
select `t1`.`Id`, `t1`.`Name`
from `Customer` as `t1`
where `t1`.`Id` = ?
limit 2

