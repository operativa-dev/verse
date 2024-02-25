-- Executing SQL: Parameters: []
select `t7`.`c3`
from (
   select json_unquote(json_extract(json_extract(json_arrayagg(json_array(`t2`.`AlbumId`, `t2`.`Title`, `t2`.`ArtistId`)), '$[0]'), '$[1]')) as `c3`
   from `Artist` as `t1` 
   left join `Album` as `t2` on `t1`.`ArtistId` = `t2`.`ArtistId`
   group by `t1`.`ArtistId`
) as `t7`
where `t7`.`c3` like 'T%'

