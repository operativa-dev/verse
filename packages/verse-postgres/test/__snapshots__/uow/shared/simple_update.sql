-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Name" = 'Customer 2'
limit 2

-- Executing SQL: Parameters: [$1='Customer 2 Updated', $2=2]
update "Customer" set "Name" = $1 where "Id" = $2

-- Executing SQL: Parameters: [$1=2]
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = $1
limit 2

