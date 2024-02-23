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

-- Executing SQL: Parameters: [$1=5]
delete from "Order" where "Oid" = ?

-- Executing SQL: Parameters: []
select "t3"."Cid", "t3"."Name", "t5"."Oid", "t5"."CustomerId"
from (
   select "t2"."Cid", "t2"."Name"
   from "Customer" as "t2"
   where "t2"."Cid" = 5
   limit 2
) as "t3" 
left join "Order" as "t5" on "t3"."Cid" = "t5"."CustomerId"
order by "t3"."Cid"

