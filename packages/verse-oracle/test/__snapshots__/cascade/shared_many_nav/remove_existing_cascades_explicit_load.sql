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

-- Executing SQL: Parameters: [$1=15]
delete from "Order" where Oid = :0

-- Executing SQL: Parameters: []
select t3.Cid, t3.Name, t5.Oid, t5.CustomerId
from (
   select t2.Cid, t2.Name
   from Customer t2
   where t2.Cid = 5
   fetch next 2 rows only
) t3 
left join "Order" t5 on t3.Cid = t5.CustomerId
order by t3.Cid

