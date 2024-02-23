-- Executing SQL: Parameters: []
select "t1"."Cid", "t1"."Name"
from "Customer" as "t1"
where "t1"."Cid" = 1
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1=1]
insert into "Order" ("CustomerId") output inserted."Oid" values (@p0)

