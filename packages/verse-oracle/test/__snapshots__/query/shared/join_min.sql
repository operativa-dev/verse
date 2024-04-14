-- Executing SQL: Parameters: []
select min(t2.ArtistId)
from Album t1 
inner join Artist t2 on t1.ArtistId = t2.ArtistId

