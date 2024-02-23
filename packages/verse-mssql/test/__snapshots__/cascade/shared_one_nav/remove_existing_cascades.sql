-- Executing SQL: Parameters: []
select "t3"."Oid", "t3"."CustomerId", "t5"."Cid", "t5"."Name"
from (
   select "t2"."Oid", "t2"."CustomerId"
   from "Order" as "t2"
   where "t2"."CustomerId" = 2
   order by 1 offset 0 rows fetch next 2 rows only
) as "t3" 
inner join "Customer" as "t5" on "t3"."CustomerId" = "t5"."Cid"

-- Executing SQL: Parameters: [$1=1]
delete from "Order" where "Oid" = @p0

-- Executing SQL: Parameters: []
select "t3"."Oid", "t3"."CustomerId", "t5"."Cid", "t5"."Name"
from (
   select "t2"."Oid", "t2"."CustomerId"
   from "Order" as "t2"
   where "t2"."CustomerId" = 2
   order by 1 offset 0 rows fetch next 1 rows only
) as "t3" 
inner join "Customer" as "t5" on "t3"."CustomerId" = "t5"."Cid"

