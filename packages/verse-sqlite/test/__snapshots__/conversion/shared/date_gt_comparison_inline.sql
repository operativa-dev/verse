-- Executing SQL: Parameters: [$1='64', $2=null, $3='1979-10-12T10:13:14.000Z']
insert into "Entity" ("Num", "Bool", "Date") values (?, ?, ?)

-- Executing SQL: Parameters: []
select "t1"."Num", "t1"."Bool", "t1"."Date"
from "Entity" as "t1"
where ("t1"."Num" = '64') and ("t1"."Date" > '1978-10-12T00:00:00.000Z')
limit 2

