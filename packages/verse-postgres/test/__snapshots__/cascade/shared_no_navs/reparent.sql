-- Executing SQL: Parameters: []
select "t1"."Oid", "t1"."CustomerId", "t1"."ProductId"
from "Order" as "t1"
where "t1"."CustomerId" = 1
limit 1

-- Executing SQL: Parameters: []
select "t1"."Oid", "t1"."CustomerId", "t1"."ProductId"
from "Order" as "t1"
where "t1"."CustomerId" = 2
limit 1

-- Executing SQL: Parameters: [$1=2, $2=101, $3=11]
update "Order" set "CustomerId" = $1, "ProductId" = $2 where "Oid" = $3

-- Executing SQL: Parameters: [$1=1, $2=101, $3=12]
update "Order" set "CustomerId" = $1, "ProductId" = $2 where "Oid" = $3

