-- Executing SQL: Parameters: [$1='Miles Ahead']
select concat(concat('Title: ', `t2`.`Title`), '!') as `c0`
from (
   select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`
   from `Album` as `t1`
   where `t1`.`Title` = ?
) as `t2`

