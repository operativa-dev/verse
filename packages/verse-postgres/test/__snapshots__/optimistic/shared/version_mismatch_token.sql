-- Executing SQL: Parameters: [$1='42', $2=123.45, $3=9]
insert into "Order" ("Id", "Amount", "Token") values ($1, $2, $3)

-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Amount", "t2"."Token"
from (
   select "t1"."Id", "t1"."Amount", "t1"."Token"
   from "Order" as "t1"
   where "t1"."Id" = '42'
) as "t2"
limit 2

-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Amount", "t2"."Token"
from (
   select "t1"."Id", "t1"."Amount", "t1"."Token"
   from "Order" as "t1"
   where "t1"."Id" = '42'
) as "t2"
limit 2

-- Executing SQL: Parameters: [$1=456.78, $2=10, $3='42', $4=9]
update "Order" set "Amount" = $1, "Token" = $2 where ("Id" = $3) and ("Token" = $4)

-- Executing SQL: Parameters: [$1=567.89, $2=10, $3='42', $4=9]
update "Order" set "Amount" = $1, "Token" = $2 where ("Id" = $3) and ("Token" = $4)

