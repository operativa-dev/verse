-- Executing SQL: Parameters: [$1='81', $2=1, $3=null]
insert into "Entity" ("Num", "Bool", "Date") values (@p0, @p1, @p2)

-- Executing SQL: Parameters: []
select "t2"."Num", "t2"."Bool", "t2"."Date"
from (
   select "t1"."Num", "t1"."Bool", "t1"."Date"
   from "Entity" as "t1"
   where '81' = "t1"."Num"
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

