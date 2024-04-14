-- Executing SQL: Parameters: []
select t1.Cid, t1.Name
from Customer t1
where t1.Cid = 1
fetch next 2 rows only

-- Executing SQL: Parameters: []
select t1.Cid, t1.Name
from Customer t1
where t1.Cid = 2
fetch next 2 rows only

-- Executing SQL: Parameters: []
select t1.Oid, t1.CustomerId
from "Order" t1
where t1.CustomerId = 1
fetch next 1 rows only

-- Executing SQL: Parameters: []
select t1.Oid, t1.CustomerId
from "Order" t1
where t1.CustomerId = 2
fetch next 1 rows only

-- Executing SQL: Parameters: [$1=2, $2=11]
update "Order" set CustomerId = :0 where Oid = :1

-- Executing SQL: Parameters: [$1=1, $2=12]
update "Order" set CustomerId = :0 where Oid = :1

