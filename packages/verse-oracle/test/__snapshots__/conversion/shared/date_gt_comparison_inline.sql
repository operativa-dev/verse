-- Executing SQL: Parameters: [$1='64', $2=null, $3=Fri Oct 12 1979 12:13:14 GMT+0200 (South Africa Standard Time)]
insert into Entity (Num, Bool, "Date") values (:0, :1, :2)

-- Executing SQL: Parameters: []
select t1.Num, t1.Bool, t1."Date"
from Entity t1
where (t1.Num = '64') and (t1."Date" > TIMESTAMP '1978-10-12 00:00:00.000 UTC')
fetch next 2 rows only

