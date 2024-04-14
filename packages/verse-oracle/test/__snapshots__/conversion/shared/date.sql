-- Executing SQL: Parameters: [$1='61', $2=null, $3=Mon Oct 11 1976 12:13:14 GMT+0200 (South Africa Standard Time)]
insert into Entity (Num, Bool, "Date") values (:0, :1, :2)

-- Executing SQL: Parameters: [$1='61']
select t1.Num, t1.Bool, t1."Date"
from Entity t1
where t1.Num = :0
fetch next 2 rows only

