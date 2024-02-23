-- Executing SQL: Parameters: []
select "t3"."Cid", "t3"."Name", "t5"."Oid", "t5"."CustomerId"
from (
   select "t2"."Cid", "t2"."Name"
   from "Customer" as "t2"
   where "t2"."Cid" = 2
   limit 2
) as "t3" 
left join "Order" as "t5" on "t3"."Cid" = "t5"."CustomerId"
order by "t3"."Cid"

-- Executing SQL: Parameters: [$1=11]
delete from "Order" where "Oid" = $1

-- Executing SQL: Parameters: []
select "t3"."Cid", "t3"."Name", "t5"."Oid", "t5"."CustomerId"
from (
   select "t2"."Cid", "t2"."Name"
   from "Customer" as "t2"
   where "t2"."Cid" = 2
   limit 2
) as "t3" 
left join "Order" as "t5" on "t3"."Cid" = "t5"."CustomerId"
order by "t3"."Cid"

