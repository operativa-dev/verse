-- Executing SQL: Parameters: [$1='42', $2=123.45, $3=9]
insert into "Order" ("Id", "Amount", "Token") values (@p0, @p1, @p2)

-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Amount", "t2"."Token"
from (
   select "t1"."Id", "t1"."Amount", "t1"."Token"
   from "Order" as "t1"
   where "t1"."Id" = '42'
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Amount", "t2"."Token"
from (
   select "t1"."Id", "t1"."Amount", "t1"."Token"
   from "Order" as "t1"
   where "t1"."Id" = '42'
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1=456.78, $2=10, $3='42', $4=9]
update "Order" set "Amount" = @p0, "Token" = @p1 where ("Id" = @p2) and ("Token" = @p3)

-- Executing SQL: Parameters: [$1=567.89, $2=10, $3='42', $4=9]
update "Order" set "Amount" = @p0, "Token" = @p1 where ("Id" = @p2) and ("Token" = @p3)

