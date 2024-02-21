-- Executing SQL: Parameters: [$1=41, $2='Existing customer', $3=1]
insert into "Customer" ("Id", "Name", "_version") values ($1, $2, $3)

-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Name", "t2"."_version"
from (
   select "t1"."Id", "t1"."Name", "t1"."_version"
   from "Customer" as "t1"
   where "t1"."Id" = 41
) as "t2"
limit 2

-- Executing SQL: Parameters: [$1='Updated customer', $2=2, $3=41, $4=1]
update "Customer" set "Name" = $1, "_version" = $2 where ("Id" = $3) and ("_version" = $4)

-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Name", "t2"."_version"
from (
   select "t1"."Id", "t1"."Name", "t1"."_version"
   from "Customer" as "t1"
   where "t1"."Id" = 41
) as "t2"
limit 2

