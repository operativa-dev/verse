-- Executing SQL: Parameters: [$1='41', $2=true, $3=null]
insert into "Entity" ("Num", "Bool", "Date") values ($1, $2, $3)

-- Executing SQL: Parameters: [$1='41', $2='<UUID>', $3=true, $4=true]
select "t4"."c0", "t4"."c1", "t4"."Bool", "t4"."c2", "t4"."c3", "t4"."c4", "t4"."c5", "t4"."c6"
from (
   select "t3"."c0", "t3"."c1", "t3"."Bool", "t3"."c2", "t3"."c3", "t3"."c4", "t3"."c5", "t3"."c6"
   from (
      select true as "c0", false as "c1", "t1"."Bool", null as "c2", null as "c3", $2 as "c4", '1976-10-11T10:13:14.000Z' as "c5", $3 as "c6"
      from "Entity" as "t1"
      where ("t1"."Num" = $1) and "t1"."Bool"
   ) as "t3"
   where ("t3"."c0" = $4) and ("t3"."Bool" = true)
) as "t4"
limit 2

