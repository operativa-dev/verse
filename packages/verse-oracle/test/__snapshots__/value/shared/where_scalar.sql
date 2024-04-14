-- Executing SQL: Parameters: []
select t1.Id, t1.Name, t1.Street, t1.City, t1.ShipStreet, t1.ShipCity, t1."From", t1."To"
from Customer t1
where t1.City = 'The Wall'

