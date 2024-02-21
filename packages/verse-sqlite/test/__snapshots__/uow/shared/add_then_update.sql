-- Executing SQL: Parameters: [$1='MSFT']
insert into "Customer" ("Name") values (?) returning "Id"

-- Executing SQL: Parameters: [$1='Microsoft', $2=5]
update "Customer" set "Name" = ? where "Id" = ?

-- Executing SQL: Parameters: [$1=5]
select "t2"."Id", "t2"."Name"
from (
   select "t1"."Id", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Id" = ?
) as "t2"
limit 2

