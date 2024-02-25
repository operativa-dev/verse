-- Executing SQL: Parameters: [$1=42, $2='Existing customer 2', $3=1]
insert into "Customer" ("Id", "Name", "_version") values ($1, $2, $3)

-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."_version"
from "Customer" as "t1"
where "t1"."Id" = 42
limit 2

-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."_version"
from "Customer" as "t1"
where "t1"."Id" = 42
limit 2

-- Executing SQL: Parameters: [$1='Updated customer again', $2=2, $3=42, $4=1]
update "Customer" set "Name" = $1, "_version" = $2 where ("Id" = $3) and ("_version" = $4)

-- Executing SQL: Parameters: [$1='Updated customer yet again', $2=2, $3=42, $4=1]
update "Customer" set "Name" = $1, "_version" = $2 where ("Id" = $3) and ("_version" = $4)

