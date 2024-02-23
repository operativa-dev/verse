-- Executing SQL: Parameters: []
select "t3"."Oid", "t3"."CustomerId", "t5"."Cid", "t5"."Name"
from (
   select "t2"."Oid", "t2"."CustomerId"
   from "Order" as "t2"
   where "t2"."CustomerId" = 2
   limit 2
) as "t3" 
inner join "Customer" as "t5" on "t3"."CustomerId" = "t5"."Cid"

-- Executing SQL: Parameters: [$1=1]
delete from "Order" where "Oid" = ?

-- Executing SQL: Parameters: []
select "t3"."Oid", "t3"."CustomerId", "t5"."Cid", "t5"."Name"
from (
   select "t2"."Oid", "t2"."CustomerId"
   from "Order" as "t2"
   where "t2"."CustomerId" = 2
   limit 1
) as "t3" 
inner join "Customer" as "t5" on "t3"."CustomerId" = "t5"."Cid"

