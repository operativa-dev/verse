-- Executing SQL: Parameters: [$1='41', $2=1, $3=null]
insert into "Entity" ("Num", "Bool", "Date") values (?, ?, ?)

-- Executing SQL: Parameters: [$1='41', $2='<UUID>', $3='1976-10-11T10:13:14.000Z', $4=1, $5=1]
select "t3"."c0", "t3"."c1", "t3"."Bool", "t3"."c2", "t3"."c3", "t3"."c4", "t3"."c5", "t3"."c6"
from (
   select 1 as "c0", 0 as "c1", "t1"."Bool", null as "c2", null as "c3", ? as "c4", ? as "c5", ? as "c6"
   from "Entity" as "t1"
   where ("t1"."Num" = ?) and "t1"."Bool"
) as "t3"
where ("t3"."c0" = ?) and ("t3"."Bool" = 1)
limit 2

