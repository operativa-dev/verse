-- Executing SQL: Parameters: []
select "t1"."Cid", "t1"."Name"
from "Customer" as "t1"
where "t1"."Cid" = 1
limit 2

-- Executing SQL: Parameters: []
select "t1"."Cid", "t1"."Name"
from "Customer" as "t1"
where "t1"."Cid" = 2
limit 2

-- Executing SQL: Parameters: []
select "t1"."Oid", "t1"."CustomerId"
from "Order" as "t1"
where "t1"."CustomerId" = 1
limit 1

-- Executing SQL: Parameters: []
select "t1"."Oid", "t1"."CustomerId"
from "Order" as "t1"
where "t1"."CustomerId" = 2
limit 1

-- Executing SQL: Parameters: [$1=2, $2=11]
update "Order" set "CustomerId" = $1 where "Oid" = $2

-- Executing SQL: Parameters: [$1=1, $2=13]
update "Order" set "CustomerId" = $1 where "Oid" = $2

