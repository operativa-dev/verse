-- Executing SQL: Parameters: []
select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`
from `Album` as `t1`
where `t1`.`ArtistId` in (1, 2)

