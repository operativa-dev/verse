-- Executing SQL: Parameters: [$1='foo']
insert into MixedKey (Other) values (:0) returning Id into :out0

-- Executing SQL: Parameters: [$1=1]
select t1.Id, t1.Other
from MixedKey t1
where (t1.Id = :0) and (t1.Other = 'foo')
fetch next 2 rows only

-- Executing SQL: Parameters: [$1=1]
select t1.Id, t1.Other
from MixedKey t1
where (t1.Id = :0) and (t1.Other = 'foo')
fetch next 1 rows only

