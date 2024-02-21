-- Executing SQL: Parameters: [$1='Customer N']
insert into "Customer" ("Name") output inserted."Cid" values (@p0)

-- Executing SQL: Parameters: [$1=-58]
insert into "Order" ("CustomerId") output inserted."Oid" values (@p0)

