-- Executing SQL: Parameters: [$1='41', $2=1, $3=null]
insert into "Entity" ("Num", "Bool", "Date") values (@p0, @p1, @p2)

-- Executing SQL: Parameters: [$1='41', $2='<UUID>', $3=1, $4=1]
select "t4"."c0", "t4"."c1", "t4"."Bool", "t4"."c2", "t4"."c3", "t4"."c4", "t4"."c5", "t4"."c6"
from (
   select "t3"."c0", "t3"."c1", "t3"."Bool", "t3"."c2", "t3"."c3", "t3"."c4", "t3"."c5", "t3"."c6"
   from (
      select 1 as "c0", 0 as "c1", "t2"."Bool", null as "c2", null as "c3", @p1 as "c4", '1976-10-11T10:13:14.000Z' as "c5", @p2 as "c6"
      from (
         select "t1"."Num", "t1"."Bool", "t1"."Date"
         from "Entity" as "t1"
         where ("t1"."Num" = @p0) and ("t1"."Bool" = 1)
      ) as "t2"
   ) as "t3"
   where ("t3"."c0" = @p3) and ("t3"."Bool" = 1)
) as "t4"
order by 1 offset 0 rows fetch next 2 rows only

