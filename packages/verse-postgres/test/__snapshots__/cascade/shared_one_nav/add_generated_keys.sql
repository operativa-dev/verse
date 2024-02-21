-- Executing SQL: Parameters: [$1=6, $2='Customer N']
insert into "Customer" ("Cid", "Name") values ($1, $2)

-- Executing SQL: Parameters: [$1=18, $2=6]
insert into "Order" ("Oid", "CustomerId") values ($1, $2)

