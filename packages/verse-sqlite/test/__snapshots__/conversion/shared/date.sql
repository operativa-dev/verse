-- Executing SQL: Parameters: [$1='61', $2=null, $3='1976-10-11T10:13:14.000Z']
insert into "Entity" ("Num", "Bool", "Date") values (?, ?, ?)

-- Executing SQL: Parameters: [$1='61']
select "t2"."Num", "t2"."Bool", "t2"."Date"
from (
   select "t1"."Num", "t1"."Bool", "t1"."Date"
   from "Entity" as "t1"
   where "t1"."Num" = ?
) as "t2"
limit 2

