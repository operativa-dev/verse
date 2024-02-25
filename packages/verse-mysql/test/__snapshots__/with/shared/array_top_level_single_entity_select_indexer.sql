-- Executing SQL: Parameters: []
select json_extract(json_arrayagg(json_array(`t2`.`ArtistId`, `t2`.`Name`)), '$[0]') as `c1`
from `Artist` as `t2`

