-- Executing SQL: Parameters: []
select `t2`.`AlbumId`, `t2`.`Title`, `t2`.`ArtistId`, `t4`.`Id`, `t4`.`Name`, `t6`.`AlbumId`, `t6`.`Title`, `t6`.`ArtistId`, `t8`.`Id`, `t8`.`Name`
from `Album` as `t2` 
inner join `Artist` as `t4` on `t2`.`ArtistId` = `t4`.`Id` 
left join `Album` as `t6` on `t4`.`Id` = `t6`.`ArtistId` 
inner join `Artist` as `t8` on `t6`.`ArtistId` = `t8`.`Id`
order by `t4`.`Id`

