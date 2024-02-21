-- Executing SQL: Parameters: [$1=42, $2='Existing customer 2', $3=1]
insert into "Customer" ("Id", "Name", "_version") values (?, ?, ?)

-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Name", "t2"."_version"
from (
   select "t1"."Id", "t1"."Name", "t1"."_version"
   from "Customer" as "t1"
   where "t1"."Id" = 42
) as "t2"
limit 2

-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Name", "t2"."_version"
from (
   select "t1"."Id", "t1"."Name", "t1"."_version"
   from "Customer" as "t1"
   where "t1"."Id" = 42
) as "t2"
limit 2

-- Executing SQL: Parameters: [$1='Updated customer again', $2=2, $3=42, $4=1]
update "Customer" set "Name" = ?, "_version" = ? where ("Id" = ?) and ("_version" = ?)

-- Executing SQL: Parameters: [$1='Updated customer yet again', $2=2, $3=42, $4=1]
update "Customer" set "Name" = ?, "_version" = ? where ("Id" = ?) and ("_version" = ?)

