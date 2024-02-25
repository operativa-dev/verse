-- Executing SQL: Parameters: [$1='Customer X']
insert into "Customer" ("Name") values (?) returning "Cid"

-- Executing SQL: Parameters: [$1='Customer Y']
insert into "Customer" ("Name") values (?) returning "Cid"

-- Executing SQL: Parameters: [$1=-15, $2=103]
insert into "Order" ("CustomerId", "ProductId") values (?, ?) returning "Oid"

-- Executing SQL: Parameters: [$1=-14, $2=102]
insert into "Order" ("CustomerId", "ProductId") values (?, ?) returning "Oid"

-- Executing SQL: Parameters: []
select "t1"."Cid", "t1"."Name"
from "Customer" as "t1"
where "t1"."Name" = 'Customer X'
limit 2

-- Executing SQL: Parameters: [$1=422]
select "t1"."Oid", "t1"."CustomerId", "t1"."ProductId"
from "Order" as "t1"
where "t1"."CustomerId" = ?
limit 2

-- Executing SQL: Parameters: []
select "t1"."Cid", "t1"."Name"
from "Customer" as "t1"
where "t1"."Name" = 'Customer Y'
limit 2

-- Executing SQL: Parameters: [$1=423]
select "t1"."Oid", "t1"."CustomerId", "t1"."ProductId"
from "Order" as "t1"
where "t1"."CustomerId" = ?
limit 2

