-- Executing SQL: Parameters: [$1='ACME Inc.']
insert into "Customer" ("Name") output inserted."Id" values (@p0)

-- Executing SQL: Parameters: [$1=4]
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = @p0
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1=4]
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = @p0
order by 1 offset 0 rows fetch next 1 rows only

