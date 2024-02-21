-- Executing SQL: Parameters: []
select `t4`.`AlbumId`, `t4`.`Title`, `t4`.`ArtistId`, `t4`.`c0`, `t4`.`Name`
from (
   select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`, `t2`.`ArtistId` as `c0`, `t2`.`Name`
   from `Album` as `t1` 
   left join `Artist` as `t2` on `t1`.`ArtistId` = `t2`.`ArtistId`
) as `t4`
limit 3

