-- Executing SQL: Parameters: []
select "t1"."Cid", "t1"."Name"
from "Customer" as "t1"
where "t1"."Cid" = 4
limit 2

-- Executing SQL: Parameters: [$1=4]
delete from "Customer" where "Cid" = $1

