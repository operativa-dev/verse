-- Executing SQL: Parameters: [$1='62', $2=null, $3='1979-10-12T10:13:14.000Z']
insert into "Entity" ("Num", "Bool", "Date") values (?, ?, ?)

-- Executing SQL: Parameters: [$1='1979-10-12T10:13:14.000Z']
select "t1"."Num", "t1"."Bool", "t1"."Date"
from "Entity" as "t1"
where ("t1"."Date" = ?) or ("t1"."Date" is null and ? is null)
limit 2

