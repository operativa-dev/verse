-- Executing SQL: Parameters: []
select `t0`.`Id`, `t0`.`Make`, `t0`.`Model`, `t0`.`Year`, `t0`.`__verse_type`, `t0`.`Ccs`, `t0`.`Wheels`, `t0`.`Doors`, `t0`.`TruckDoors`, `t0`.`Capacity`
from `Vehicle` as `t0`
where ((((`t0`.`__verse_type` = 'Motorbike') or (`t0`.`__verse_type` = 'Vehicle')) or (`t0`.`__verse_type` = 'Automobile')) or (`t0`.`__verse_type` = 'Car')) or (`t0`.`__verse_type` = 'Truck')

