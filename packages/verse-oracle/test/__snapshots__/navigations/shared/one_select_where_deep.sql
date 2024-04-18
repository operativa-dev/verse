-- Executing SQL: Parameters: []
select t6.Name c0
from Album t2 
inner join Artist t6 on t2.ArtistId = t6.ArtistId 
inner join Artist t3 on t2.ArtistId = t3.ArtistId
where t3.Name = 'Alice In Chains'

