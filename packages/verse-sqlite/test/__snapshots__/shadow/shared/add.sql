-- Executing SQL: Parameters: [$1='ACME Inc.', $2=0, $3='Howick Ave', $4='Johannesburg', $5='South Africa']
insert into "Customer" ("Name", "Deleted", "Street", "City", "Country") values (?, ?, ?, ?, ?) returning "Id"

-- Executing SQL: Parameters: [$1=2]
select "t1"."Id", "t1"."Name", "t1"."Deleted", "t1"."Street", "t1"."City", "t1"."Country"
from "Customer" as "t1"
where "t1"."Id" = ?
limit 2

