-- Executing SQL: Parameters: []
select "t2"."Cid", "t2"."Name"
from (
   select "t1"."Cid", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Cid" = 4
) as "t2"
limit 2

-- Executing SQL: Parameters: [$1=4]
delete from "Customer" where "Cid" = ?

