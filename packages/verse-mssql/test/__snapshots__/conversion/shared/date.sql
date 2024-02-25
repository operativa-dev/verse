-- Executing SQL: Parameters: [$1='61', $2=null, $3=Mon Oct 11 1976 12:13:14 GMT+0200 (South Africa Standard Time)]
insert into "Entity" ("Num", "Bool", "Date") values (@p0, @p1, @p2)

-- Executing SQL: Parameters: [$1='61']
select "t1"."Num", "t1"."Bool", "t1"."Date"
from "Entity" as "t1"
where "t1"."Num" = @p0
order by 1 offset 0 rows fetch next 2 rows only

