-- Executing SQL: Parameters: [$1='Customer 3']
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Name" = @p0
order by 1 offset 0 rows fetch next 2 rows only

