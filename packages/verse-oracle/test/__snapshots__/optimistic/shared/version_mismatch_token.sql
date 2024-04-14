-- Executing SQL: Parameters: [$1='42', $2=123.45, $3=9]
insert into "Order" (Id, Amount, Token) values (:0, :1, :2)

-- Executing SQL: Parameters: []
select t1.Id, t1.Amount, t1.Token
from "Order" t1
where t1.Id = '42'
fetch next 2 rows only

-- Executing SQL: Parameters: []
select t1.Id, t1.Amount, t1.Token
from "Order" t1
where t1.Id = '42'
fetch next 2 rows only

-- Executing SQL: Parameters: [$1=456.78, $2=10, $3='42', $4=9]
update "Order" set Amount = :0, Token = :1 where (Id = :2) and (Token = :3)

-- Executing SQL: Parameters: [$1=567.89, $2=10, $3='42', $4=9]
update "Order" set Amount = :0, Token = :1 where (Id = :2) and (Token = :3)

