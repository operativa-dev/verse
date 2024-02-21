-- Executing SQL: Parameters: [$1='<UUID>', $2='ACME Inc.']
insert into "Customer" ("Id", "Name") values (?, ?)

-- Executing SQL: Parameters: [$1='<UUID>']
select "t2"."Id", "t2"."Name"
from (
   select "t1"."Id", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Id" = ?
) as "t2"
limit 2

