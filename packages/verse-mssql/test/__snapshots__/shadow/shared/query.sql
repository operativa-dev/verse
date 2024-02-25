-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."Deleted", "t1"."Street", "t1"."City", "t1"."Country"
from "Customer" as "t1"
where "t1"."Deleted" = 1
order by 1 offset 0 rows fetch next 2 rows only

