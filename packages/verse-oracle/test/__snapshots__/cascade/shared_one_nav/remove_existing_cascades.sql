-- Executing SQL: Parameters: []
select t3.Oid, t3.CustomerId, t5.Cid, t5.Name
from (
   select t2.Oid, t2.CustomerId
   from "Order" t2
   where t2.CustomerId = 2
   fetch next 2 rows only
) t3 
inner join Customer t5 on t3.CustomerId = t5.Cid

-- Executing SQL: Parameters: [$1=11]
delete from "Order" where Oid = :0

-- Executing SQL: Parameters: []
select t3.Oid, t3.CustomerId, t5.Cid, t5.Name
from (
   select t2.Oid, t2.CustomerId
   from "Order" t2
   where t2.CustomerId = 2
   fetch next 1 rows only
) t3 
inner join Customer t5 on t3.CustomerId = t5.Cid

