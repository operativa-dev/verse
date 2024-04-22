-- Executing SQL: Parameters: [$1=4, $2='ACME Inc.']
insert into Customer (Id, Name) values (:0, :1)

-- Executing SQL: Parameters: [$1=4]
select t1.Id, t1.Name
from Customer t1
where t1.Id = :0
fetch next 2 rows only

-- Executing SQL: Parameters: [$1=4]
select t1.Id, t1.Name
from Customer t1
where t1.Id = :0
fetch next 1 rows only

