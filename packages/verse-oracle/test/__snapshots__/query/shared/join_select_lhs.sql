-- Executing SQL: Parameters: []
select t1.Composer
from Track t1 
inner join Album t2 on t1.AlbumId = t2.AlbumId
order by t1.Composer

