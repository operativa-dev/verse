-- Executing SQL: Parameters: [$1=420, $2='Customer 420']
set identity_insert "Customer" on
insert into "Customer" ("Cid", "Name") values (@p0, @p1)
set identity_insert "Customer" off

-- Executing SQL: Parameters: [$1=420, $2=101]
insert into "Order" ("CustomerId", "ProductId") output inserted."Oid" values (@p0, @p1)

