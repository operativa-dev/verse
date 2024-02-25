-- Executing SQL: Parameters: []
select (
   select `t8`.`c1`
   from (
      select json_unquote(json_extract(json_arrayagg(`t3`.`Title`), '$[0]')) as `c1`
      from `Album` as `t3`
      where `t3`.`Title` like 'T%'
      limit 5
   ) as `t8`
   order by `t8`.`c1`
) as `c2`
from `Artist` as `t1`

