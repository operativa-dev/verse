-- Executing SQL: Parameters: []
select "__verse_seqhilo".nextval
from DUAL

-- Executing SQL: Parameters: [$1=1]
insert into NonKeyIdentity (Id) values (:0) returning NonKey into :out0

-- Executing SQL: Parameters: [$1=1]
select t1.Id, t1.NonKey
from NonKeyIdentity t1
where t1.Id = :0
fetch next 2 rows only

