-- Executing SQL: Parameters: []
select "t1"."Cid", "t1"."Name"
from "Customer" as "t1"
where "t1"."Cid" = 5
limit 2

-- Executing SQL: Parameters: []
select "t1"."Oid", "t1"."CustomerId"
from "Order" as "t1"
where "t1"."CustomerId" = 5
limit 2

-- Executing SQL: Parameters: []
select "t3"."Oid", "t3"."CustomerId", "t5"."Cid", "t5"."Name"
from (
   select "t2"."Oid", "t2"."CustomerId"
   from "Order" as "t2"
   where "t2"."CustomerId" = 2
   limit 1
) as "t3" 
inner join "Customer" as "t5" on "t3"."CustomerId" = "t5"."Cid"

