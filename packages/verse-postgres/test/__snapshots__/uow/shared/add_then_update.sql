-- Executing SQL: Parameters: [$1=5, $2='MSFT']
insert into "Customer" ("Id", "Name") values ($1, $2)

-- Executing SQL: Parameters: [$1='Microsoft', $2=5]
update "Customer" set "Name" = $1 where "Id" = $2

-- Executing SQL: Parameters: [$1=5]
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = $1
limit 2

