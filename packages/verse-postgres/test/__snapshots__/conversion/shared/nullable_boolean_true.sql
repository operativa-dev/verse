-- Executing SQL: Parameters: [$1='77', $2=true, $3=null]
insert into "Entity" ("Num", "Bool", "Date") values ($1, $2, $3)

-- Executing SQL: Parameters: []
select "t1"."Num", "t1"."Bool", "t1"."Date"
from "Entity" as "t1"
where ("t1"."Num" = '77') and "t1"."Bool"
limit 2

