-- Executing SQL: Parameters: [$1='62', $2=null, $3=Fri Oct 12 1979 12:13:14 GMT+0200 (South Africa Standard Time)]
insert into "Entity" ("Num", "Bool", "Date") values (@p0, @p1, @p2)

-- Executing SQL: Parameters: [$1=Fri Oct 12 1979 12:13:14 GMT+0200 (South Africa Standard Time)]
select "t1"."Num", "t1"."Bool", "t1"."Date"
from "Entity" as "t1"
where ("t1"."Date" = @p0) or ("t1"."Date" is null and @p0 is null)
order by 1 offset 0 rows fetch next 2 rows only

