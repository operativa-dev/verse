-- Executing SQL: Parameters: [$1='63', $2=null, $3=Fri Oct 12 1979 12:13:14 GMT+0200 (South Africa Standard Time)]
insert into Entity (Num, Bool, "Date") values (:0, :1, :2)

-- Executing SQL: Parameters: []
select t1.Num, t1.Bool, t1."Date"
from Entity t1
where (t1.Num = '63') and (t1."Date" = TIMESTAMP '1979-10-12 10:13:14.000 UTC')
fetch next 2 rows only

