-- Executing SQL: Parameters: []
select `t5`.`c1`
from (
   select json_arrayagg(`t2`.`Title`) as `c1`
   from `Artist` as `t1` 
   left join `Album` as `t2` on `t1`.`ArtistId` = `t2`.`ArtistId`
   group by `t1`.`ArtistId`
) as `t5`
where `t5`.`c1` ->> '$[0]' like 'T%'

