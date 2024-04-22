-- Executing SQL: Parameters: [$1='69', $2=0, $3=null]
insert into Entity (Num, Bool, "Date") values (:0, :1, :2)

-- Executing SQL: Parameters: []
select t1.Num, t1.Bool, t1."Date"
from Entity t1
where (t1.Num = '69') and not (t1.Bool = 1)
fetch next 2 rows only

