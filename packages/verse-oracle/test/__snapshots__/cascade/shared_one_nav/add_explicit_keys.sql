-- Executing SQL: Parameters: [$1=420, $2='Customer 420']
insert into Customer (Cid, Name) values (:0, :1)

-- Executing SQL: Parameters: [$1=17, $2=420]
insert into "Order" (Oid, CustomerId) values (:0, :1)

