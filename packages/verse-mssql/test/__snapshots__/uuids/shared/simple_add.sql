-- Executing SQL: Parameters: [$1='<UUID>', $2='ACME Inc.']
insert into "Customer" ("Id", "Name") values (@p0, @p1)

-- Executing SQL: Parameters: [$1='<UUID>']
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = @p0
order by 1 offset 0 rows fetch next 2 rows only

