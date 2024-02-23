-- Executing SQL: Parameters: []
select "t1"."Cid", "t1"."Name"
from "Customer" as "t1"
where "t1"."Cid" = 3
limit 2

-- Executing SQL: Parameters: []
select "t1"."Oid", "t1"."CustomerId"
from "Order" as "t1"
where "t1"."CustomerId" = 3

-- Executing SQL: Parameters: [$1=13]
delete from "Order" where "Oid" = $1

-- Executing SQL: Parameters: [$1=3]
delete from "Customer" where "Cid" = $1

