-- Executing SQL: Parameters: []
select "t1"."Oid", "t1"."CustomerId", "t1"."ProductId"
from "Order" as "t1"
where "t1"."CustomerId" = 1
order by 1 offset 0 rows fetch next 1 rows only

-- Executing SQL: Parameters: []
select "t1"."Oid", "t1"."CustomerId", "t1"."ProductId"
from "Order" as "t1"
where "t1"."CustomerId" = 2
order by 1 offset 0 rows fetch next 1 rows only

-- Executing SQL: Parameters: [$1=2, $2=101, $3=1]
update "Order" set "CustomerId" = @p0, "ProductId" = @p1 where "Oid" = @p2

-- Executing SQL: Parameters: [$1=1, $2=101, $3=2]
update "Order" set "CustomerId" = @p0, "ProductId" = @p1 where "Oid" = @p2

