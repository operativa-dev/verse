-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."Deleted", "t1"."Street", "t1"."City", "t1"."Country"
from "Customer" as "t1"
where "t1"."Name" = 'Customer 1'
limit 2

-- Executing SQL: Parameters: [$1='Customer 1', $2=true, $3='Howick Ave', $4='Johannesburg', $5='South Africa', $6=1]
update "Customer" set "Name" = $1, "Deleted" = $2, "Street" = $3, "City" = $4, "Country" = $5 where "Id" = $6

-- Executing SQL: Parameters: [$1=1]
select "t1"."Id", "t1"."Name", "t1"."Deleted", "t1"."Street", "t1"."City", "t1"."Country"
from "Customer" as "t1"
where "t1"."Id" = $1
limit 2

