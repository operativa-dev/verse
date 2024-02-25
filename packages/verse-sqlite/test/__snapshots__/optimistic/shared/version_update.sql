-- Executing SQL: Parameters: [$1=41, $2='Existing customer', $3=1]
insert into "Customer" ("Id", "Name", "_version") values (?, ?, ?)

-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."_version"
from "Customer" as "t1"
where "t1"."Id" = 41
limit 2

-- Executing SQL: Parameters: [$1='Updated customer', $2=2, $3=41, $4=1]
update "Customer" set "Name" = ?, "_version" = ? where ("Id" = ?) and ("_version" = ?)

-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."_version"
from "Customer" as "t1"
where "t1"."Id" = 41
limit 2

