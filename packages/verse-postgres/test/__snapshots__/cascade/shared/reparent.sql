-- Executing SQL: Parameters: []
select "t2"."Oid", "t2"."CustomerId"
from (
   select "t1"."Oid", "t1"."CustomerId"
   from "Order" as "t1"
   where "t1"."CustomerId" = 1
) as "t2"
limit 1

-- Executing SQL: Parameters: []
select "t2"."Oid", "t2"."CustomerId"
from (
   select "t1"."Oid", "t1"."CustomerId"
   from "Order" as "t1"
   where "t1"."CustomerId" = 2
) as "t2"
limit 1

-- Executing SQL: Parameters: [$1=2, $2=11]
update "Order" set "CustomerId" = $1 where "Oid" = $2

-- Executing SQL: Parameters: [$1=1, $2=12]
update "Order" set "CustomerId" = $1 where "Oid" = $2

