-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Name"
from (
   select "t1"."Id", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Name" = 'Customer 3'
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

