-- Executing SQL: Parameters: [$1=4, $2='ACME Inc.']
insert into "Customer" ("Id", "Name") values ($1, $2)

-- Executing SQL: Parameters: [$1=4]
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = $1
limit 2

-- Executing SQL: Parameters: [$1=4]
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = $1
limit 1

