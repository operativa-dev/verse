-- Executing SQL: Parameters: []
select "t1"."Cid", "t1"."Name"
from "Customer" as "t1"
where "t1"."Cid" = 1
limit 2

-- Executing SQL: Parameters: [$1=19, $2=1]
insert into "Order" ("Oid", "CustomerId") values ($1, $2)

