-- Executing SQL: Parameters: []
select `t1`.`Id`, `t1`.`Name`, `t1`.`Street`, `t1`.`City`, `t1`.`ShipStreet`, `t1`.`ShipCity`
from `Customer` as `t1`
where 'The Wall' = `t1`.`City`

