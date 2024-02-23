-- Executing SQL: Parameters: []
select `t1`.`Cid`, `t1`.`Name`
from `Customer` as `t1`
where `t1`.`Cid` = 3
limit 2

-- Executing SQL: Parameters: []
select `t1`.`Oid`, `t1`.`CustomerId`, `t1`.`ProductId`
from `Order` as `t1`
where `t1`.`CustomerId` = 3

-- Executing SQL: Parameters: [$1=3]
delete from `Order` where `Oid` = ?

-- Executing SQL: Parameters: [$1=3]
delete from `Customer` where `Cid` = ?

