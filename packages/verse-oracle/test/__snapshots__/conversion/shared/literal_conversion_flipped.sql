-- Executing SQL: Parameters: [$1='81', $2=1, $3=null]
insert into Entity (Num, Bool, "Date") values (:0, :1, :2)

-- Executing SQL: Parameters: []
select t1.Num, t1.Bool, t1."Date"
from Entity t1
where '81' = t1.Num
fetch next 2 rows only

