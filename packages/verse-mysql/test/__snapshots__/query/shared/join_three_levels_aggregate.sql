-- Executing SQL: Parameters: []
select avg(`t4`.`ArtistId` + `t5`.`ArtistId`)
from (
   select `t1`.`TrackId`, `t1`.`Name`, `t1`.`AlbumId`, `t1`.`GenreId`, `t1`.`Composer`, `t2`.`AlbumId` as `c0`, `t2`.`Title`, `t2`.`ArtistId`
   from `Track` as `t1` 
   inner join `Album` as `t2` on `t1`.`AlbumId` = `t2`.`AlbumId`
) as `t4` 
inner join `Artist` as `t5` on `t4`.`ArtistId` = `t5`.`ArtistId`

