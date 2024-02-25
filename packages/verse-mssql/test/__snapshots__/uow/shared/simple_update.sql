-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Name" = 'Customer 2'
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1='Customer 2 Updated', $2=2]
update "Customer" set "Name" = @p0 where "Id" = @p1

-- Executing SQL: Parameters: [$1=2]
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = @p0
order by 1 offset 0 rows fetch next 2 rows only

