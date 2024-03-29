-- Executing SQL: Parameters: []
select "t2"."Cid", "t2"."Name"
from (
   select "t1"."Cid", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Cid" = 1
) as "t2"
limit 2

-- Executing SQL: Parameters: [$1=1]
insert into "Order" ("CustomerId") values (?) returning "Oid"

