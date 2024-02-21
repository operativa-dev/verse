-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."Street", "t1"."City", "t1"."ShipStreet", "t1"."ShipCity"
from "Customer" as "t1"
limit 2

-- Executing SQL: Parameters: [$1='John Snow', $2='Winterfell', $3='The North', $4='Riverrun', $5='Riverlands', $6=1]
update "Customer" set "Name" = ?, "Street" = ?, "City" = ?, "ShipStreet" = ?, "ShipCity" = ? where "Id" = ?

-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."Street", "t1"."City", "t1"."ShipStreet", "t1"."ShipCity"
from "Customer" as "t1"
limit 2

