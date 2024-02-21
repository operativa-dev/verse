-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Name"
from (
   select "t1"."Id", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Name" = 'Customer 1'
) as "t2"
limit 2

-- Executing SQL: Parameters: [$1=1]
delete from "Customer" where "Id" = $1

-- Executing SQL: Parameters: [$1=1]
select "t2"."Id", "t2"."Name"
from (
   select "t1"."Id", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Id" = $1
) as "t2"
limit 2

