-- Executing SQL: Parameters: []
select "t2"."Cid", "t2"."Name"
from (
   select "t1"."Cid", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Cid" = 1
) as "t2"
limit 2

-- Executing SQL: Parameters: []
select "t2"."Cid", "t2"."Name"
from (
   select "t1"."Cid", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Cid" = 2
) as "t2"
limit 2

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

-- Executing SQL: Parameters: [$1=2, $2=1]
update "Order" set "CustomerId" = ? where "Oid" = ?

-- Executing SQL: Parameters: [$1=1, $2=3]
update "Order" set "CustomerId" = ? where "Oid" = ?

