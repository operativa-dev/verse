-- Executing SQL: Parameters: [$1=6, $2='Customer N']
insert into Customer (Cid, Name) values (:0, :1)

-- Executing SQL: Parameters: [$1=18, $2=6]
insert into "Order" (Oid, CustomerId) values (:0, :1)

