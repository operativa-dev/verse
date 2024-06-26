-- Executing SQL: Parameters: [$1='41', $2=1, $3=null]
insert into "Entity" ("Num", "Bool", "Date") values (@p0, @p1, @p2)

-- Executing SQL: Parameters: [$1='41', $2='<UUID>', $3=Mon Oct 11 1976 12:13:14 GMT+0200 (South Africa Standard Time), $4=1, $5=1]
select "t3"."c0", "t3"."c1", "t3"."Bool", "t3"."c2", "t3"."c3", "t3"."c4", "t3"."c5", "t3"."c6"
from (
   select 1 as "c0", 0 as "c1", "t1"."Bool", null as "c2", null as "c3", @p1 as "c4", @p2 as "c5", @p3 as "c6"
   from "Entity" as "t1"
   where ("t1"."Num" = @p0) and ("t1"."Bool" = 1)
) as "t3"
where ("t3"."c0" = @p4) and ("t3"."Bool" = 1)
order by 1 offset 0 rows fetch next 2 rows only

