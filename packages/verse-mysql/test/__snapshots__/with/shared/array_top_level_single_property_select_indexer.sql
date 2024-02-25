-- Executing SQL: Parameters: []
select json_unquote(json_extract(json_arrayagg(`t2`.`Name`), '$[0]')) as `c1`
from `Artist` as `t2`

