-- Executing SQL: Parameters: [$1=49, $2='Existing customer 2', $3=1]
insert into "Customer" ("Id", "Name", "_version") values (@p0, @p1, @p2)

-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."_version"
from "Customer" as "t1"
where "t1"."Id" = 49
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."_version"
from "Customer" as "t1"
where "t1"."Id" = 49
order by 1 offset 0 rows fetch next 2 rows only

-- Executing SQL: Parameters: [$1='Updated customer again', $2=2, $3=49, $4=1]
update "Customer" set "Name" = @p0, "_version" = @p1 where ("Id" = @p2) and ("_version" = @p3)

-- Executing SQL: Parameters: [$1='Product 1']
insert into "Product" ("Name") output inserted."Id" values (@p0)

-- Executing SQL: Parameters: [$1='Updated customer yet again', $2=2, $3=49, $4=1]
update "Customer" set "Name" = @p0, "_version" = @p1 where ("Id" = @p2) and ("_version" = @p3)

