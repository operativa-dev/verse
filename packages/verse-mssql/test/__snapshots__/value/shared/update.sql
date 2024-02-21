-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."Street", "t1"."City", "t1"."ShipStreet", "t1"."ShipCity"
from "Customer" as "t1"
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1='John Snow', $2='Winterfell', $3='The North', $4='Riverrun', $5='Riverlands', $6=1]
update "Customer" set "Name" = @p0, "Street" = @p1, "City" = @p2, "ShipStreet" = @p3, "ShipCity" = @p4 where "Id" = @p5

-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."Street", "t1"."City", "t1"."ShipStreet", "t1"."ShipCity"
from "Customer" as "t1"
order by 1 offset 0 rows fetch next 2 rows only

