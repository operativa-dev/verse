-- Executing SQL: Parameters: [$1=5, $2='Customer N']
insert into "Customer" ("Cid", "Name") values ($1, $2)

-- Executing SQL: Parameters: [$1=16, $2=5, $3=101]
insert into "Order" ("Oid", "CustomerId", "ProductId") values ($1, $2, $3)

