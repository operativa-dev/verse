-- Executing SQL: Parameters: []
select t1.Cid, t1.Name
from Customer t1
where t1.Cid = 5
fetch next 2 rows only

-- Executing SQL: Parameters: []
select t1.Oid, t1.CustomerId
from "Order" t1
where t1.CustomerId = 5
fetch next 2 rows only

-- Executing SQL: Parameters: []
select t3.Oid, t3.CustomerId, t5.Cid, t5.Name
from (
   select t2.Oid, t2.CustomerId
   from "Order" t2
   where t2.CustomerId = 2
   fetch next 1 rows only
) t3 
inner join Customer t5 on t3.CustomerId = t5.Cid

