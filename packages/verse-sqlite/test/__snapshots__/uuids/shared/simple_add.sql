-- Executing SQL: Parameters: [$1='<UUID>', $2='ACME Inc.']
insert into "Customer" ("Id", "Name") values (?, ?)

-- Executing SQL: Parameters: [$1='<UUID>']
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = ?
limit 2

