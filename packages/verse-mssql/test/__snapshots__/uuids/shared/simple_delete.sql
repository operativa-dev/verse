-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Name" = 'Customer 1'
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1='<UUID>']
delete from "Customer" where "Id" = @p0

-- Executing SQL: Parameters: [$1='<UUID>']
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = @p0
order by 1 offset 0 rows fetch next 2 rows only

