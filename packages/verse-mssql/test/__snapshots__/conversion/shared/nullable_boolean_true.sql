-- Executing SQL: Parameters: [$1='77', $2=1, $3=null]
insert into "Entity" ("Num", "Bool", "Date") values (@p0, @p1, @p2)

-- Executing SQL: Parameters: []
select "t2"."Num", "t2"."Bool", "t2"."Date"
from (
   select "t1"."Num", "t1"."Bool", "t1"."Date"
   from "Entity" as "t1"
   where ("t1"."Num" = '77') and ("t1"."Bool" = 1)
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

