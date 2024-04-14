-- Executing SQL: Parameters: []
select t1.Oid, t1.CustomerId, t1.ProductId
from "Order" t1
where t1.CustomerId = 1
fetch next 1 rows only

-- Executing SQL: Parameters: []
select t1.Oid, t1.CustomerId, t1.ProductId
from "Order" t1
where t1.CustomerId = 2
fetch next 1 rows only

-- Executing SQL: Parameters: [$1=2, $2=101, $3=11]
update "Order" set CustomerId = :0, ProductId = :1 where Oid = :2

-- Executing SQL: Parameters: [$1=1, $2=101, $3=12]
update "Order" set CustomerId = :0, ProductId = :1 where Oid = :2

