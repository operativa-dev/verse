-- Executing SQL: Parameters: []
select `t2`.`AlbumId`, `t2`.`Title`, `t2`.`ArtistId`
from (
   select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`
   from `Album` as `t1`
   limit 18446744073709551615 offset 3
) as `t2`
limit 5

