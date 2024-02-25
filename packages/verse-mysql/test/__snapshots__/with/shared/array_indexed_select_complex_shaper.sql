-- Executing SQL: Parameters: []
select json_unquote(json_extract(json_extract(json_arrayagg(json_array(`t1`.`ArtistId`, `t1`.`Name`)), '$[0]'), '$[1]')) as `c1`, json_extract(json_arrayagg(json_array(`t1`.`ArtistId`, `t1`.`Name`)), '$[1]') as `c2`, json_extract(json_arrayagg(json_array(`t1`.`ArtistId`, `t1`.`Name`)), '$[2]') as `c3`
from `Artist` as `t1`

