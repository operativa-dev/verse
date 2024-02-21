-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Name", "t2"."Deleted", "t4"."Id", "t4"."Quantity", "t4"."ProductId", "t4"."Deleted"
from (
   select "t0"."Id", "t0"."Name", "t0"."Deleted"
   from "Product" as "t0"
   where not ("t0"."Deleted" = 1)
) as "t2" 
left join (
   select "t3"."Id", "t3"."Quantity", "t3"."ProductId", "t3"."Deleted"
   from "Order" as "t3"
   where not ("t3"."Deleted" = 1)
) as "t4" on "t2"."Id" = "t4"."ProductId"
order by "t2"."Id"

