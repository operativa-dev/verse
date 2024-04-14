-- Executing SQL: Parameters: [$1='41', $2=true, $3=null]
insert into "Entity" ("Num", "Bool", "Date") values ($1, $2, $3)

-- Executing SQL: Parameters: [$1='41', $2='<UUID>', $3=Mon Oct 11 1976 12:13:14 GMT+0200 (South Africa Standard Time), $4=true, $5=true]
select "t3"."c0", "t3"."c1", "t3"."Bool", "t3"."c2", "t3"."c3", "t3"."c4", "t3"."c5", "t3"."c6"
from (
   select true as "c0", false as "c1", "t1"."Bool", null as "c2", null as "c3", $2 as "c4", $3 as "c5", $4 as "c6"
   from "Entity" as "t1"
   where ("t1"."Num" = $1) and "t1"."Bool"
) as "t3"
where ("t3"."c0" = $5) and ("t3"."Bool" = true)
limit 2

