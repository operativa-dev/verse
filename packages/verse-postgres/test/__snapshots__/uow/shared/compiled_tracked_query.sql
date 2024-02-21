-- Executing SQL: Parameters: [$1='Customer 3']
select "t2"."Id", "t2"."Name"
from (
   select "t1"."Id", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Name" = $1
) as "t2"
limit 2

