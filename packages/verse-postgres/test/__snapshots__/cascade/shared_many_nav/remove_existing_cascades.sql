-- Executing SQL: Parameters: []
select "t4"."Cid", "t4"."Name", "t6"."Oid", "t6"."CustomerId"
from (
   select "t3"."Cid", "t3"."Name"
   from (
      select "t2"."Cid", "t2"."Name"
      from "Customer" as "t2"
      where "t2"."Cid" = 2
   ) as "t3"
   limit 2
) as "t4" 
left join "Order" as "t6" on "t4"."Cid" = "t6"."CustomerId"
order by "t4"."Cid"

-- Executing SQL: Parameters: [$1=11]
delete from "Order" where "Oid" = $1

-- Executing SQL: Parameters: []
select "t4"."Cid", "t4"."Name", "t6"."Oid", "t6"."CustomerId"
from (
   select "t3"."Cid", "t3"."Name"
   from (
      select "t2"."Cid", "t2"."Name"
      from "Customer" as "t2"
      where "t2"."Cid" = 2
   ) as "t3"
   limit 2
) as "t4" 
left join "Order" as "t6" on "t4"."Cid" = "t6"."CustomerId"
order by "t4"."Cid"

