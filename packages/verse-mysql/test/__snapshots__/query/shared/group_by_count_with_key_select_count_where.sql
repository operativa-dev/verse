-- Executing SQL: Parameters: []
select `t4`.`c0`
from (
   select `t3`.`c0`
   from (
      select `t2`.`c0`
      from (
         select `t1`.`ArtistId`, count(*) as `c0`
         from `Album` as `t1`
         group by `t1`.`ArtistId`
      ) as `t2`
   ) as `t3`
   where `t3`.`c0` > 10
) as `t4`
order by `t4`.`c0`

