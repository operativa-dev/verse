-- Executing SQL: Parameters: []
select `t1`.`TrackId`, `t1`.`Name`, `t1`.`AlbumId`, `t1`.`GenreId`, `t1`.`Composer`
from `Track` as `t1`
where -`t1`.`GenreId` = -1
