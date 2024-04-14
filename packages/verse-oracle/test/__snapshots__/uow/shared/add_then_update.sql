-- Executing SQL: Parameters: [$1=5, $2='MSFT']
insert into Customer (Id, Name) values (:0, :1)

-- Executing SQL: Parameters: [$1='Microsoft', $2=5]
update Customer set Name = :0 where Id = :1

-- Executing SQL: Parameters: [$1=5]
select t1.Id, t1.Name
from Customer t1
where t1.Id = :0
fetch next 2 rows only

