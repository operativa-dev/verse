-- Executing SQL: Parameters: [$1=7]
select count(*)
from (
   select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`
   from `Album` as `t1`
   limit ?
) as `t2`

