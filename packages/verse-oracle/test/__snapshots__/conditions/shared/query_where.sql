-- Executing SQL: Parameters: []
select t1.Id, t1.Name, t1.Deleted
from (
   select t0.Id, t0.Name, t0.Deleted
   from Product t0
   where not (t0.Deleted = 1)
) t1
where t1.Name = 'Bugatti Veyron'

