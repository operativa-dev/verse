-- Executing SQL: Parameters: []
select t1.Cid, t1.Name
from Customer t1
where t1.Cid = 3
fetch next 2 rows only

-- Executing SQL: Parameters: []
select t1.Oid, t1.CustomerId, t1.ProductId
from "Order" t1
where t1.CustomerId = 3

-- Executing SQL: Parameters: [$1=13]
delete from "Order" where Oid = :0

-- Executing SQL: Parameters: [$1=3]
delete from Customer where Cid = :0

