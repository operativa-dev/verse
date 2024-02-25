-- Executing SQL: Parameters: [$1='MSFT']
insert into "Customer" ("Name") output inserted."Id" values (@p0)

-- Executing SQL: Parameters: [$1='Microsoft', $2=5]
update "Customer" set "Name" = @p0 where "Id" = @p1

-- Executing SQL: Parameters: [$1=5]
select "t1"."Id", "t1"."Name"
from "Customer" as "t1"
where "t1"."Id" = @p0
order by 1 offset 0 rows fetch next 2 rows only

