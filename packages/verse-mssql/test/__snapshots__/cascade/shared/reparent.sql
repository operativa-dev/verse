-- Executing SQL: Parameters: []
select "t2"."Oid", "t2"."CustomerId"
from (
   select "t1"."Oid", "t1"."CustomerId"
   from "Order" as "t1"
   where "t1"."CustomerId" = 1
) as "t2"
order by 1 offset 0 rows fetch next 1 rows only

-- Executing SQL: Parameters: []
select "t2"."Oid", "t2"."CustomerId"
from (
   select "t1"."Oid", "t1"."CustomerId"
   from "Order" as "t1"
   where "t1"."CustomerId" = 2
) as "t2"
order by 1 offset 0 rows fetch next 1 rows only

-- Executing SQL: Parameters: [$1=2, $2=1]
update "Order" set "CustomerId" = @p0 where "Oid" = @p1

-- Executing SQL: Parameters: [$1=1, $2=2]
update "Order" set "CustomerId" = @p0 where "Oid" = @p1

