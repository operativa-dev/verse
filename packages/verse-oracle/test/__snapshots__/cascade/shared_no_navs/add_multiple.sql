-- Executing SQL: Parameters: [$1=6, $2='Customer X']
insert into Customer (Cid, Name) values (:0, :1)

-- Executing SQL: Parameters: [$1=7, $2='Customer Y']
insert into Customer (Cid, Name) values (:0, :1)

-- Executing SQL: Parameters: [$1=18, $2=7, $3=103]
insert into "Order" (Oid, CustomerId, ProductId) values (:0, :1, :2)

-- Executing SQL: Parameters: [$1=19, $2=6, $3=102]
insert into "Order" (Oid, CustomerId, ProductId) values (:0, :1, :2)

-- Executing SQL: Parameters: []
select t1.Cid, t1.Name
from Customer t1
where t1.Name = 'Customer X'
fetch next 2 rows only

-- Executing SQL: Parameters: [$1=6]
select t1.Oid, t1.CustomerId, t1.ProductId
from "Order" t1
where t1.CustomerId = :0
fetch next 2 rows only

-- Executing SQL: Parameters: []
select t1.Cid, t1.Name
from Customer t1
where t1.Name = 'Customer Y'
fetch next 2 rows only

-- Executing SQL: Parameters: [$1=7]
select t1.Oid, t1.CustomerId, t1.ProductId
from "Order" t1
where t1.CustomerId = :0
fetch next 2 rows only

