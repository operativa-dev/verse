-- Executing SQL: Parameters: [$1='<UUID>', $2='ACME Inc.']
insert into "Customer" ("Id", "Name") values ($1, $2)

-- Executing SQL: Parameters: [$1='<UUID>']
select "t2"."Id", "t2"."Name"
from (
   select "t1"."Id", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Id" = $1
) as "t2"
limit 2

