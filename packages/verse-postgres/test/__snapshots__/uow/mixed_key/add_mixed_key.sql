-- Executing SQL: Parameters: [$1='foo']
insert into "MixedKey" ("Other") values ($1) returning "Id"

-- Executing SQL: Parameters: [$1=1]
select "t2"."Id", "t2"."Other"
from (
   select "t1"."Id", "t1"."Other"
   from "MixedKey" as "t1"
   where ("t1"."Id" = $1) and ("t1"."Other" = 'foo')
) as "t2"
limit 2

-- Executing SQL: Parameters: [$1=1]
select "t2"."Id", "t2"."Other"
from (
   select "t1"."Id", "t1"."Other"
   from "MixedKey" as "t1"
   where ("t1"."Id" = $1) and ("t1"."Other" = 'foo')
) as "t2"
limit 1

