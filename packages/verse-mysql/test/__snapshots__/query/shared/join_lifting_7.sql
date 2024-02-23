-- Executing SQL: Parameters: []
select `t6`.`Name` as `c2`
from (
   select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`, `t2`.`ArtistId` as `c0`, `t2`.`Name`
   from `Album` as `t1` 
   inner join `Artist` as `t2` on `t1`.`ArtistId` = `t2`.`ArtistId`
   where `t2`.`Name` = 'Alice In Chains'
) as `t5` 
inner join `Artist` as `t6` on `t5`.`ArtistId` = `t6`.`ArtistId`

