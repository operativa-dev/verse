-- Executing SQL: Parameters: []
select "t4"."Oid", "t4"."CustomerId", "t6"."Cid", "t6"."Name"
from (
   select "t3"."Oid", "t3"."CustomerId"
   from (
      select "t2"."Oid", "t2"."CustomerId"
      from "Order" as "t2"
      where "t2"."CustomerId" = 2
   ) as "t3"
   order by 1 offset 0 rows fetch next 2 rows only
) as "t4" 
inner join "Customer" as "t6" on "t4"."CustomerId" = "t6"."Cid"

-- Executing SQL: Parameters: [$1=1]
delete from "Order" where "Oid" = @p0

-- Executing SQL: Parameters: []
select "t4"."Oid", "t4"."CustomerId", "t6"."Cid", "t6"."Name"
from (
   select "t3"."Oid", "t3"."CustomerId"
   from (
      select "t2"."Oid", "t2"."CustomerId"
      from "Order" as "t2"
      where "t2"."CustomerId" = 2
   ) as "t3"
   order by 1 offset 0 rows fetch next 1 rows only
) as "t4" 
inner join "Customer" as "t6" on "t4"."CustomerId" = "t6"."Cid"

