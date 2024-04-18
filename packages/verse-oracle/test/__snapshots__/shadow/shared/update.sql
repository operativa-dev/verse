-- Executing SQL: Parameters: []
select t1.Id, t1.Name, t1.Deleted, t1.Street, t1.City, t1.Country
from Customer t1
where t1.Name = 'Customer 1'
fetch next 2 rows only

-- Executing SQL: Parameters: [$1='Customer 1', $2=1, $3='Howick Ave', $4='Johannesburg', $5='South Africa', $6=1]
update Customer set Name = :0, Deleted = :1, Street = :2, City = :3, Country = :4 where Id = :5

-- Executing SQL: Parameters: [$1=1]
select t1.Id, t1.Name, t1.Deleted, t1.Street, t1.City, t1.Country
from Customer t1
where t1.Id = :0
fetch next 2 rows only

