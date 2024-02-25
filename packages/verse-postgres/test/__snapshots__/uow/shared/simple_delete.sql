-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Name" = 'Customer 1'
limit 2

-- Executing SQL: Parameters: [$1=1]
delete from "Customer" where "Id" = $1

-- Executing SQL: Parameters: [$1=1]
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = $1
limit 2

