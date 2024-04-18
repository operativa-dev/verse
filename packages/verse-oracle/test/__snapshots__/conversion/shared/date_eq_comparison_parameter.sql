-- Executing SQL: Parameters: [$1='62', $2=null, $3=Fri Oct 12 1979 12:13:14 GMT+0200 (South Africa Standard Time)]
insert into Entity (Num, Bool, "Date") values (:0, :1, :2)

-- Executing SQL: Parameters: [$1=Fri Oct 12 1979 12:13:14 GMT+0200 (South Africa Standard Time)]
select t1.Num, t1.Bool, t1."Date"
from Entity t1
where (t1."Date" = :0) or (t1."Date" is null and :0 is null)
fetch next 2 rows only

