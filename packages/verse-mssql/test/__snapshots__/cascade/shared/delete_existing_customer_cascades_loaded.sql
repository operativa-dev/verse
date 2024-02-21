-- Executing SQL: Parameters: []
select "t2"."Cid", "t2"."Name"
from (
   select "t1"."Cid", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Cid" = 3
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: []
select "t1"."Oid", "t1"."CustomerId"
from "Order" as "t1"
where "t1"."CustomerId" = 3

-- Executing SQL: Parameters: [$1=3]
delete from "Order" where "Oid" = @p0

-- Executing SQL: Parameters: [$1=3]
delete from "Customer" where "Cid" = @p0

