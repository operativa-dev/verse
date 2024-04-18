-- Executing SQL: Parameters: []
select t1.Id, t1.Name, t1.Street, t1.City, t1.ShipStreet, t1.ShipCity, t1."From", t1."To"
from Customer t1
fetch next 2 rows only

-- Executing SQL: Parameters: [$1='John Snow', $2='Winterfell', $3='The North', $4='Riverrun', $5='Riverlands', $6=1, $7=10, $8=1]
update Customer set Name = :0, Street = :1, City = :2, ShipStreet = :3, ShipCity = :4, "From" = :5, "To" = :6 where Id = :7

-- Executing SQL: Parameters: []
select t1.Id, t1.Name, t1.Street, t1.City, t1.ShipStreet, t1.ShipCity, t1."From", t1."To"
from Customer t1
fetch next 2 rows only

