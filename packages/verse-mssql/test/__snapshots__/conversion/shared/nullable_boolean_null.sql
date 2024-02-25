-- Executing SQL: Parameters: [$1='99', $2=null, $3=null]
insert into "Entity" ("Num", "Bool", "Date") values (@p0, @p1, @p2)

-- Executing SQL: Parameters: []
select "t1"."Num", "t1"."Bool", "t1"."Date"
from "Entity" as "t1"
where ("t1"."Num" = '99') and "t1"."Bool" is null
order by 1 offset 0 rows fetch next 2 rows only

