-- Executing SQL: Parameters: [$1='62', $2=null, $3=Fri Oct 12 1979 12:13:14 GMT+0200 (South Africa Standard Time)]
insert into "Entity" ("Num", "Bool", "Date") values ($1, $2, $3)

-- Executing SQL: Parameters: [$1=Fri Oct 12 1979 12:13:14 GMT+0200 (South Africa Standard Time)]
select "t2"."Num", "t2"."Bool", "t2"."Date"
from (
   select "t1"."Num", "t1"."Bool", "t1"."Date"
   from "Entity" as "t1"
   where ("t1"."Date" = $1) or ("t1"."Date" is null and $1 is null)
) as "t2"
limit 2

