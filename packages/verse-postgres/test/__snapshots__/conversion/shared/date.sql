-- Executing SQL: Parameters: [$1='61', $2=null, $3=Mon Oct 11 1976 12:13:14 GMT+0200 (South Africa Standard Time)]
insert into "Entity" ("Num", "Bool", "Date") values ($1, $2, $3)

-- Executing SQL: Parameters: [$1='61']
select "t1"."Num", "t1"."Bool", "t1"."Date"
from "Entity" as "t1"
where "t1"."Num" = $1
limit 2

