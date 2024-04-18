-- Executing SQL: Parameters: [$1='99', $2=null, $3=null]
insert into Entity (Num, Bool, "Date") values (:0, :1, :2)

-- Executing SQL: Parameters: []
select t1.Num, t1.Bool, t1."Date"
from Entity t1
where (t1.Num = '99') and t1.Bool is null
fetch next 2 rows only

