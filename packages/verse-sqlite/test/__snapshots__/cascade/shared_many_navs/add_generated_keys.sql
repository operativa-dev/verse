-- Executing SQL: Parameters: [$1='Customer N']
insert into "Customer" ("Name") values (?) returning "Cid"

-- Executing SQL: Parameters: [$1=-23]
insert into "Order" ("CustomerId") values (?) returning "Oid"

