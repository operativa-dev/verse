-- Executing SQL: Parameters: []
select t1.Title
from Album t1 
inner join Artist t2 on t1.ArtistId = t2.ArtistId
where t2.Name = 'Alice In Chains'

