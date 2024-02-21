-- Executing SQL: Parameters: [$1=420, $2='Customer 420']
insert into "Customer" ("Cid", "Name") values (?, ?)

-- Executing SQL: Parameters: [$1=420, $2=101]
insert into "Order" ("CustomerId", "ProductId") values (?, ?) returning "Oid"

