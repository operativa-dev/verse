-- Executing SQL: Parameters: []
select `t4`.`c1`
from (
   select json_unquote(json_extract(json_extract(json_arrayagg(json_array(`t2`.`ArtistId`, `t2`.`Name`)), '$[0]'), '$[1]')) as `c1`
   from `Artist` as `t2`
) as `t4`
where `t4`.`c1` = 'AC/DC'

