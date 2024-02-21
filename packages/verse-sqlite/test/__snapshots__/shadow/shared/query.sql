-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Name", "t2"."Deleted", "t2"."Street", "t2"."City", "t2"."Country"
from (
   select "t1"."Id", "t1"."Name", "t1"."Deleted", "t1"."Street", "t1"."City", "t1"."Country"
   from "Customer" as "t1"
   where "t1"."Deleted"
) as "t2"
limit 2

