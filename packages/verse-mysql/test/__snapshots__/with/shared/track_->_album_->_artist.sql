-- Executing SQL: Parameters: [$1=3]
select `t4`.`TrackId`, `t4`.`Name`, `t4`.`AlbumId`, `t4`.`GenreId`, `t4`.`Composer`, `t6`.`AlbumId`, `t6`.`Title`, `t6`.`ArtistId`, `t8`.`ArtistId`, `t8`.`Name`
from (
   select `t3`.`TrackId`, `t3`.`Name`, `t3`.`AlbumId`, `t3`.`GenreId`, `t3`.`Composer`
   from `Track` as `t3`
   order by `t3`.`Composer`
   limit ?
) as `t4` 
inner join `Album` as `t6` on `t4`.`AlbumId` = `t6`.`AlbumId` 
inner join `Artist` as `t8` on `t6`.`ArtistId` = `t8`.`ArtistId`
order by `t4`.`Composer`

