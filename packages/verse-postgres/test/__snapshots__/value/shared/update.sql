-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."Street", "t1"."City", "t1"."ShipStreet", "t1"."ShipCity", "t1"."From", "t1"."To"
from "Customer" as "t1"
limit 2

-- Executing SQL: Parameters: [$1='John Snow', $2='Winterfell', $3='The North', $4='Riverrun', $5='Riverlands', $6=1, $7=10, $8=1]
update "Customer" set "Name" = $1, "Street" = $2, "City" = $3, "ShipStreet" = $4, "ShipCity" = $5, "From" = $6, "To" = $7 where "Id" = $8

-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."Street", "t1"."City", "t1"."ShipStreet", "t1"."ShipCity", "t1"."From", "t1"."To"
from "Customer" as "t1"
limit 2

