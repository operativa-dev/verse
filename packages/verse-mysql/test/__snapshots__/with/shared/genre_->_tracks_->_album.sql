-- Executing SQL: Parameters: []
select `t3`.`GenreId`, `t3`.`Name`, `t5`.`TrackId`, `t5`.`Name`, `t5`.`AlbumId`, `t5`.`GenreId`, `t5`.`Composer`, `t7`.`AlbumId`, `t7`.`Title`, `t7`.`ArtistId`
from (
   select `t2`.`GenreId`, `t2`.`Name`
   from `Genre` as `t2`
   where `t2`.`Name` = 'Jazz'
) as `t3` 
left join `Track` as `t5` on `t3`.`GenreId` = `t5`.`GenreId` 
inner join `Album` as `t7` on `t5`.`AlbumId` = `t7`.`AlbumId`
order by `t3`.`GenreId`

