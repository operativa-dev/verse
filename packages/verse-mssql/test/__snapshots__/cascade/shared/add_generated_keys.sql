-- Executing SQL: Parameters: [$1='Customer N']
insert into "Customer" ("Name") output inserted."Cid" values (@p0)

-- Executing SQL: Parameters: [$1=-11]
insert into "Order" ("CustomerId") output inserted."Oid" values (@p0)

