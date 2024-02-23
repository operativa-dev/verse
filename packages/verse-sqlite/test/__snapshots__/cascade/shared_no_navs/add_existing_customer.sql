-- Executing SQL: Parameters: []
select "t1"."Cid", "t1"."Name"
from "Customer" as "t1"
where "t1"."Cid" = 1
limit 2

-- Executing SQL: Parameters: [$1=1, $2=101]
insert into "Order" ("CustomerId", "ProductId") values (?, ?) returning "Oid"

