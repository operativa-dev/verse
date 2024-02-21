-- Executing SQL: Parameters: [$1='Miles Ahead']
select `t3`.`c0`, `t3`.`c1`
from (
   select concat(concat('Hi ', `t2`.`Title`), '!') as `c0`, `t2`.`ArtistId` * 2 as `c1`
   from (
      select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`
      from `Album` as `t1`
      where `t1`.`Title` = ?
   ) as `t2`
) as `t3`
where `t3`.`c1` > 12

