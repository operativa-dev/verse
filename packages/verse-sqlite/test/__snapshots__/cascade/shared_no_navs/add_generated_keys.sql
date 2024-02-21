-- Executing SQL: Parameters: [$1='Customer N']
insert into "Customer" ("Name") values (?) returning "Cid"

-- Executing SQL: Parameters: [$1=-11, $2=101]
insert into "Order" ("CustomerId", "ProductId") values (?, ?) returning "Oid"

