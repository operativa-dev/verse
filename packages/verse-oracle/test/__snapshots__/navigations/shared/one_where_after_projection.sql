-- Executing SQL: Parameters: []
select t2.AlbumId, t2.Title, t2.ArtistId
from Album t2 
inner join Artist t3 on t2.ArtistId = t3.ArtistId
where t3.Name = 'Alice In Chains'

