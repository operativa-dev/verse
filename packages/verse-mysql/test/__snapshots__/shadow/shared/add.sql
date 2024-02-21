-- Executing SQL: Parameters: [$1='ACME Inc.', $2=0, $3='Howick Ave', $4='Johannesburg', $5='South Africa']
insert into `Customer` (`Name`, `Deleted`, `Street`, `City`, `Country`) values (?, ?, ?, ?, ?);
select `Id` from `Customer` where `Id` = last_insert_id()

-- Executing SQL: Parameters: [$1=2]
select `t2`.`Id`, `t2`.`Name`, `t2`.`Deleted`, `t2`.`Street`, `t2`.`City`, `t2`.`Country`
from (
   select `t1`.`Id`, `t1`.`Name`, `t1`.`Deleted`, `t1`.`Street`, `t1`.`City`, `t1`.`Country`
   from `Customer` as `t1`
   where `t1`.`Id` = ?
) as `t2`
limit 2

