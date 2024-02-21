-- Executing SQL: Parameters: [$1='Customer N']
insert into "Customer" ("Name") output inserted."Cid" values (@p0)

-- Executing SQL: Parameters: [$1=-11, $2=101]
insert into "Order" ("CustomerId", "ProductId") output inserted."Oid" values (@p0, @p1)

