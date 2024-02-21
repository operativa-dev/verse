-- Executing SQL: Parameters: []
select `t2`.`Cid`, `t2`.`Name`
from (
   select `t1`.`Cid`, `t1`.`Name`
   from `Customer` as `t1`
   where `t1`.`Cid` = 5
) as `t2`
limit 2

-- Executing SQL: Parameters: []
select `t2`.`Oid`, `t2`.`CustomerId`
from (
   select `t1`.`Oid`, `t1`.`CustomerId`
   from `Order` as `t1`
   where `t1`.`CustomerId` = 5
) as `t2`
limit 2

-- Executing SQL: Parameters: []
select `t4`.`Oid`, `t4`.`CustomerId`, `t6`.`Cid`, `t6`.`Name`
from (
   select `t3`.`Oid`, `t3`.`CustomerId`
   from (
      select `t2`.`Oid`, `t2`.`CustomerId`
      from `Order` as `t2`
      where `t2`.`CustomerId` = 2
   ) as `t3`
   limit 1
) as `t4` 
inner join `Customer` as `t6` on `t4`.`CustomerId` = `t6`.`Cid`

