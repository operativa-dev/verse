-- Executing SQL: Parameters: [$1='Customer X']
insert into "Customer" ("Name") output inserted."Cid" values (@p0)

-- Executing SQL: Parameters: [$1='Customer Y']
insert into "Customer" ("Name") output inserted."Cid" values (@p0)

-- Executing SQL: Parameters: [$1=-15, $2=103]
insert into "Order" ("CustomerId", "ProductId") output inserted."Oid" values (@p0, @p1)

-- Executing SQL: Parameters: [$1=-14, $2=102]
insert into "Order" ("CustomerId", "ProductId") output inserted."Oid" values (@p0, @p1)

-- Executing SQL: Parameters: []
select "t2"."Cid", "t2"."Name"
from (
   select "t1"."Cid", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Name" = 'Customer X'
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1=422]
select "t2"."Oid", "t2"."CustomerId", "t2"."ProductId"
from (
   select "t1"."Oid", "t1"."CustomerId", "t1"."ProductId"
   from "Order" as "t1"
   where "t1"."CustomerId" = @p0
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: []
select "t2"."Cid", "t2"."Name"
from (
   select "t1"."Cid", "t1"."Name"
   from "Customer" as "t1"
   where "t1"."Name" = 'Customer Y'
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1=423]
select "t2"."Oid", "t2"."CustomerId", "t2"."ProductId"
from (
   select "t1"."Oid", "t1"."CustomerId", "t1"."ProductId"
   from "Order" as "t1"
   where "t1"."CustomerId" = @p0
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

