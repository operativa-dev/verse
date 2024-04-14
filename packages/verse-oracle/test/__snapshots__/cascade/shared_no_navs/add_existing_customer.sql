-- Executing SQL: Parameters: []
select t1.Cid, t1.Name
from Customer t1
where t1.Cid = 1
fetch next 2 rows only

-- Executing SQL: Parameters: [$1=17, $2=1, $3=101]
insert into "Order" (Oid, CustomerId, ProductId) values (:0, :1, :2)

