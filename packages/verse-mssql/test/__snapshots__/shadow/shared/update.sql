-- Executing SQL: Parameters: []
select "t2"."Id", "t2"."Name", "t2"."Deleted", "t2"."Street", "t2"."City", "t2"."Country"
from (
   select "t1"."Id", "t1"."Name", "t1"."Deleted", "t1"."Street", "t1"."City", "t1"."Country"
   from "Customer" as "t1"
   where "t1"."Name" = 'Customer 1'
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1='Customer 1', $2=1, $3='Howick Ave', $4='Johannesburg', $5='South Africa', $6=1]
update "Customer" set "Name" = @p0, "Deleted" = @p1, "Street" = @p2, "City" = @p3, "Country" = @p4 where "Id" = @p5

-- Executing SQL: Parameters: [$1=1]
select "t2"."Id", "t2"."Name", "t2"."Deleted", "t2"."Street", "t2"."City", "t2"."Country"
from (
   select "t1"."Id", "t1"."Name", "t1"."Deleted", "t1"."Street", "t1"."City", "t1"."Country"
   from "Customer" as "t1"
   where "t1"."Id" = @p0
) as "t2"
order by 1 offset 0 rows fetch next 2 rows only

