-- Executing SQL: Parameters: []
select `t3`.`ArtistId`, `t3`.`Name`, `t5`.`AlbumId`, `t5`.`Title`, `t5`.`ArtistId`
from (
   select `t2`.`ArtistId`, `t2`.`Name`
   from `Artist` as `t2`
   limit 5
) as `t3` 
left join `Album` as `t5` on `t3`.`ArtistId` = `t5`.`ArtistId`
order by `t3`.`ArtistId`

