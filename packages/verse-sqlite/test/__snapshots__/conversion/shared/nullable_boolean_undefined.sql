-- Executing SQL: Parameters: [$1='23', $2=null, $3=null]
insert into "Entity" ("Num", "Bool", "Date") values (?, ?, ?)

-- Executing SQL: Parameters: []
select "t1"."Num", "t1"."Bool", "t1"."Date"
from "Entity" as "t1"
where ("t1"."Num" = '23') and "t1"."Bool" is null
limit 2

