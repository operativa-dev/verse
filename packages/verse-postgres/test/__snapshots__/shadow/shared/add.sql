-- Executing SQL: Parameters: [$1=2, $2='ACME Inc.', $3=false, $4='Howick Ave', $5='Johannesburg', $6='South Africa']
insert into "Customer" ("Id", "Name", "Deleted", "Street", "City", "Country") values ($1, $2, $3, $4, $5, $6)

-- Executing SQL: Parameters: [$1=2]
select "t1"."Id", "t1"."Name", "t1"."Deleted", "t1"."Street", "t1"."City", "t1"."Country"
from "Customer" as "t1"
where "t1"."Id" = $1
limit 2

