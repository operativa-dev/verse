-- Executing SQL: Parameters: [$1='Customer 3']
select t1.Id, t1.Name
from Customer t1
where t1.Name = :0
fetch next 2 rows only

