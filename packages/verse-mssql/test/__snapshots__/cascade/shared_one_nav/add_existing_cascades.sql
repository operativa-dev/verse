-- Executing SQL: Parameters: []
select "t1"."Cid", "t1"."Name"
from "Customer" as "t1"
where "t1"."Cid" = 1
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: []
select "t1"."Oid", "t1"."CustomerId"
from "Order" as "t1"
where "t1"."CustomerId" = 2
order by 1 offset 0 rows fetch next 1 rows only

-- Executing SQL: Parameters: [$1=1, $2=2]
update "Order" set "CustomerId" = @p0 where "Oid" = @p1

