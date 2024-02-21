-- Executing SQL: Parameters: []
select `t2`.`AlbumId`, `t2`.`Title`, `t2`.`ArtistId`, `t4`.`Id`, `t4`.`Name`
from `Album` as `t2` 
inner join `Artist` as `t4` on `t2`.`ArtistId` = `t4`.`Id`

