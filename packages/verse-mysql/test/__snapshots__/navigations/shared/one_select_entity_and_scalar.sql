-- Executing SQL: Parameters: []
select (
   select json_array(`t2`.`ArtistId`, `t2`.`Name`) as `c0`
   from `Artist` as `t2`
   where `t1`.`ArtistId` = `t2`.`ArtistId`
) as `c1`, `t4`.`Name` as `c2`
from `Album` as `t1` 
inner join `Artist` as `t4` on `t1`.`ArtistId` = `t4`.`ArtistId`

