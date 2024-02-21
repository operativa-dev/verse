-- Executing SQL: Parameters: []
select "t2"."Cid", "t2"."Name"
from (
   select "t1"."Cid", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Cid" = 1
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1=1, $2=101]
insert into "Order" ("CustomerId", "ProductId") output inserted."Oid" values (@p0, @p1)

