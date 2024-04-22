-- Executing SQL: Parameters: []
select t7.c0
from (
   select t5.Name c0
   from Album t1 
   inner join Artist t5 on t1.ArtistId = t5.ArtistId 
   inner join Artist t2 on t1.ArtistId = t2.ArtistId
   where t2.Name = 'Alice In Chains'
) t7
where t7.c0 = 'Alice In Chains'

