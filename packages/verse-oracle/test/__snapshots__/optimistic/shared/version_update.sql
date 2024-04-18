-- Executing SQL: Parameters: [$1=41, $2='Existing customer', $3=1]
insert into Customer (Id, Name, "_version") values (:0, :1, :2)

-- Executing SQL: Parameters: []
select t1.Id, t1.Name, t1."_version"
from Customer t1
where t1.Id = 41
fetch next 2 rows only

-- Executing SQL: Parameters: [$1='Updated customer', $2=2, $3=41, $4=1]
update Customer set Name = :0, "_version" = :1 where (Id = :2) and ("_version" = :3)

-- Executing SQL: Parameters: []
select t1.Id, t1.Name, t1."_version"
from Customer t1
where t1.Id = 41
fetch next 2 rows only

