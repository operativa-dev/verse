-- Executing SQL: Parameters: [$1=420, $2='Customer 420']
insert into Customer (Cid, Name) values (:0, :1)

-- Executing SQL: Parameters: [$1=15, $2=420, $3=101]
insert into "Order" (Oid, CustomerId, ProductId) values (:0, :1, :2)

