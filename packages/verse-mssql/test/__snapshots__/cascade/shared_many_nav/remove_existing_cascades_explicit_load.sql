-- Executing SQL: Parameters: []
select "t2"."Cid", "t2"."Name"
from (
   select "t1"."Cid", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Cid" = 5
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: []
select "t2"."Oid", "t2"."CustomerId"
from (
   select "t1"."Oid", "t1"."CustomerId"
   from "Order" as "t1"
   where "t1"."CustomerId" = 5
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1=5]
delete from "Order" where "Oid" = @p0

-- Executing SQL: Parameters: []
select "t4"."Cid", "t4"."Name", "t6"."Oid", "t6"."CustomerId"
from (
   select "t3"."Cid", "t3"."Name"
   from (
      select "t2"."Cid", "t2"."Name"
      from "Customer" as "t2"
      where "t2"."Cid" = 5
   ) as "t3"
   order by 1 offset 0 rows fetch next 2 rows only
) as "t4" 
left join "Order" as "t6" on "t4"."Cid" = "t6"."CustomerId"
order by "t4"."Cid"

