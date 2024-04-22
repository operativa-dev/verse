-- Executing SQL: Parameters: [$1=2, $2='ACME Inc.', $3=0, $4='Howick Ave', $5='Johannesburg', $6='South Africa']
insert into Customer (Id, Name, Deleted, Street, City, Country) values (:0, :1, :2, :3, :4, :5)

-- Executing SQL: Parameters: [$1=2]
select t1.Id, t1.Name, t1.Deleted, t1.Street, t1.City, t1.Country
from Customer t1
where t1.Id = :0
fetch next 2 rows only

