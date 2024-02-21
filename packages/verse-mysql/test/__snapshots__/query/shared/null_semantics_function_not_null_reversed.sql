-- Executing SQL: Parameters: [$1=null]
select `t1`.`TrackId`, `t1`.`Name`, `t1`.`AlbumId`, `t1`.`GenreId`, `t1`.`Composer`
from `Track` as `t1`
where (? <> substr(`t1`.`Composer`, 0 + 1, 5)) or (? is null and substr(`t1`.`Composer`, 0 + 1, 5) is not null)

