-- Executing SQL: Parameters: []
select t1.Id, t1.Name
from Customer t1
where t1.Name = 'Customer 1'
fetch next 2 rows only

-- Executing SQL: Parameters: [$1=1]
delete from Customer where Id = :0

-- Executing SQL: Parameters: [$1=1]
select t1.Id, t1.Name
from Customer t1
where t1.Id = :0
fetch next 2 rows only

