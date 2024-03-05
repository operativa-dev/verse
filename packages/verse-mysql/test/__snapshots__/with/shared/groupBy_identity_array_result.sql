-- Executing SQL: Parameters: []
select json_arrayagg(json_array(`t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`)) as `c0`
from `Album` as `t1`
group by `t1`.`ArtistId`

