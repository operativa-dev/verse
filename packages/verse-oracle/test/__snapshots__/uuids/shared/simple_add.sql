-- Executing SQL: Parameters: [$1=<UUID>, $2='ACME Inc.']
insert into Customer (Id, Name) values (:0, :1)

-- Executing SQL: Parameters: [$1=<UUID>]
select t1.Id, t1.Name
from Customer t1
where t1.Id = :0
fetch next 2 rows only

