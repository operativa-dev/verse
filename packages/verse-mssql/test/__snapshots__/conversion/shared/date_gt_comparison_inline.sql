-- Executing SQL: Parameters: [$1='64', $2=null, $3=Fri Oct 12 1979 12:13:14 GMT+0200 (South Africa Standard Time)]
insert into "Entity" ("Num", "Bool", "Date") values (@p0, @p1, @p2)

-- Executing SQL: Parameters: []
select "t1"."Num", "t1"."Bool", "t1"."Date"
from "Entity" as "t1"
where ("t1"."Num" = '64') and ("t1"."Date" > '1978-10-12T00:00:00.000Z')
order by 1 offset 0 rows fetch next 2 rows only

