-- Executing SQL: Parameters: [$1=1]
select json_extract(json_arrayagg(json_array(`t2`.`ArtistId`, `t2`.`Name`)), '$[0]') as `c1`
from (
   select `t1`.`ArtistId`, `t1`.`Name`
   from `Artist` as `t1`
   limit ?
) as `t2`

