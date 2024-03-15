-- Executing SQL: Parameters: []
select min(`t2`.`ArtistId`)
from `Album` as `t1` 
inner join `Artist` as `t2` on `t1`.`ArtistId` = `t2`.`ArtistId`

