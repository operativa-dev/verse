-- Executing SQL: Parameters: []
select t1.Id, t1.Name
from Customer t1
where t1.Name = 'Customer 2'
fetch next 2 rows only

-- Executing SQL: Parameters: [$1='Customer 2 Updated', $2=2]
update Customer set Name = :0 where Id = :1

-- Executing SQL: Parameters: [$1=2]
select t1.Id, t1.Name
from Customer t1
where t1.Id = :0
fetch next 2 rows only

