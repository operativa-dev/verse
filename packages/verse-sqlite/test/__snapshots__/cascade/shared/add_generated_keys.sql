-- Executing SQL: Parameters: [$1='Customer N']
insert into "Customer" ("Name") values (?) returning "Cid"

-- Executing SQL: Parameters: [$1=-11]
insert into "Order" ("CustomerId") values (?) returning "Oid"

