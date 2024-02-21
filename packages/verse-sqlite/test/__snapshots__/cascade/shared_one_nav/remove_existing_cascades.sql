-- Executing SQL: Parameters: []
select "t4"."Oid", "t4"."CustomerId", "t6"."Cid", "t6"."Name"
from (
   select "t3"."Oid", "t3"."CustomerId"
   from (
      select "t2"."Oid", "t2"."CustomerId"
      from "Order" as "t2"
      where "t2"."CustomerId" = 2
   ) as "t3"
   limit 2
) as "t4" 
inner join "Customer" as "t6" on "t4"."CustomerId" = "t6"."Cid"

-- Executing SQL: Parameters: [$1=1]
delete from "Order" where "Oid" = ?

-- Executing SQL: Parameters: []
select "t4"."Oid", "t4"."CustomerId", "t6"."Cid", "t6"."Name"
from (
   select "t3"."Oid", "t3"."CustomerId"
   from (
      select "t2"."Oid", "t2"."CustomerId"
      from "Order" as "t2"
      where "t2"."CustomerId" = 2
   ) as "t3"
   limit 1
) as "t4" 
inner join "Customer" as "t6" on "t4"."CustomerId" = "t6"."Cid"

