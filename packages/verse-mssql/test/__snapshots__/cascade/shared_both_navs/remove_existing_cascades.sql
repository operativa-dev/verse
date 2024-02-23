-- Executing SQL: Parameters: []
select "t3"."Cid", "t3"."Name", "t5"."Oid", "t5"."CustomerId"
from (
   select "t2"."Cid", "t2"."Name"
   from "Customer" as "t2"
   where "t2"."Cid" = 2
   order by 1 offset 0 rows fetch next 2 rows only
) as "t3" 
left join "Order" as "t5" on "t3"."Cid" = "t5"."CustomerId"
order by "t3"."Cid"

-- Executing SQL: Parameters: [$1=1]
delete from "Order" where "Oid" = @p0

-- Executing SQL: Parameters: []
select "t3"."Cid", "t3"."Name", "t5"."Oid", "t5"."CustomerId"
from (
   select "t2"."Cid", "t2"."Name"
   from "Customer" as "t2"
   where "t2"."Cid" = 2
   order by 1 offset 0 rows fetch next 2 rows only
) as "t3" 
left join "Order" as "t5" on "t3"."Cid" = "t5"."CustomerId"
order by "t3"."Cid"

